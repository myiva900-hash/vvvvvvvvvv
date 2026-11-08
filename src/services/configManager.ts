import { ExportableConfig } from '../types/vpn';

const ENCRYPTION_MAGIC = 'MYV-CFG-V2::';

// Deterministic simple XOR cipher for obfuscation & encoding secrets in client-side config envelope
function obscureString(input: string, key: string): string {
  let output = '';
  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    output += String.fromCharCode(charCode);
  }
  return btoa(unescape(encodeURIComponent(output)));
}

function revealString(base64Input: string, key: string): string {
  try {
    const decoded = decodeURIComponent(escape(atob(base64Input)));
    let output = '';
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      output += String.fromCharCode(charCode);
    }
    return output;
  } catch {
    throw new Error('Corrupted or invalid encrypted payload structure.');
  }
}

// Generate device HWID mock stored in localStorage
export function getOrCreateDeviceId(): string {
  const STORAGE_KEY = 'myv_vpn_device_hwid';
  let hwid = localStorage.getItem(STORAGE_KEY);
  if (!hwid) {
    const randomHex = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();
    hwid = `MYV-AND-${randomHex.slice(0, 4)}-${randomHex.slice(4, 8)}-${randomHex.slice(8, 12)}-${randomHex.slice(12, 16)}`;
    localStorage.setItem(STORAGE_KEY, hwid);
  }
  return hwid;
}

export function exportConfigToFile(config: ExportableConfig, password?: string): string {
  const secretKey = password ? `myv_salt_${password}` : 'myv_default_master_tunnel_v2';
  const jsonStr = JSON.stringify(config);
  const ciphered = obscureString(jsonStr, secretKey);

  const envelope = {
    header: ENCRYPTION_MAGIC,
    version: config.version,
    configName: config.configName,
    note: config.note,
    locked: config.locked,
    passwordProtected: Boolean(password),
    hwidLocked: config.hwidLocked,
    targetHwid: config.hwidLocked ? config.targetHwid : undefined,
    expiryDate: config.expiryDate,
    checksum: config.configName.length * 1337 + 42,
    payload: ciphered,
  };

  return JSON.stringify(envelope, null, 2);
}

export function parseAndValidateConfig(
  fileContent: string,
  providedPassword?: string,
  currentHwid?: string
): { success: boolean; config?: ExportableConfig; error?: string } {
  try {
    const envelope = JSON.parse(fileContent);

    if (!envelope || !envelope.header || !envelope.payload) {
      return { success: false, error: 'Invalid configuration format. Missing MYV signature headers.' };
    }

    if (!envelope.header.startsWith('MYV-CFG-')) {
      return { success: false, error: 'Unsupported config format. Must be an official Mutiganda Yvan VPN (.myv) profile.' };
    }

    // Expiry check
    if (envelope.expiryDate) {
      const exp = new Date(envelope.expiryDate).getTime();
      if (!isNaN(exp) && Date.now() > exp) {
        return { 
          success: false, 
          error: `This configuration expired on ${new Date(exp).toLocaleDateString()}. Please request a fresh configuration file.` 
        };
      }
    }

    // HWID Lock check
    if (envelope.hwidLocked) {
      const userHwid = currentHwid || getOrCreateDeviceId();
      if (envelope.targetHwid && envelope.targetHwid !== userHwid) {
        return {
          success: false,
          error: `Device Hardware ID mismatch. This file is locked to hardware [${envelope.targetHwid}]. Your ID is [${userHwid}].`
        };
      }
    }

    // Password check
    const secretKey = envelope.passwordProtected 
      ? (providedPassword ? `myv_salt_${providedPassword}` : null) 
      : 'myv_default_master_tunnel_v2';

    if (envelope.passwordProtected && !providedPassword) {
      return {
        success: false,
        error: 'PASSWORD_REQUIRED'
      };
    }

    if (!secretKey) {
      return { success: false, error: 'Password required to decrypt this configuration.' };
    }

    let decrypted: string;
    try {
      decrypted = revealString(envelope.payload, secretKey);
    } catch {
      return { success: false, error: 'Decryption failed: Incorrect password provided or corrupted file payload.' };
    }

    const parsedConfig: ExportableConfig = JSON.parse(decrypted);

    if (!parsedConfig.connectionMode || !parsedConfig.serverHost) {
      return { success: false, error: 'Malformed profile settings: missing required connection parameters.' };
    }

    return {
      success: true,
      config: parsedConfig
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown parsing error';
    return {
      success: false,
      error: `Failed to import configuration: ${message}`
    };
  }
}
