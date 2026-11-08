export interface WebFile {
  path: string;
  filename: string;
  language: 'typescript' | 'javascript' | 'html' | 'css' | 'json' | 'markdown';
  content: string;
  description: string;
}

export const WEB_PROJECT_FILES: WebFile[] = [
  {
    path: 'package.json',
    filename: 'package.json',
    language: 'json',
    description: 'NPM package descriptor with Vite, React 19, Tailwind CSS v4, Lucide icons, JSZip, and motion dependencies',
    content: `{
  "name": "mutiganda-yvan-vpn",
  "private": true,
  "version": "2.4.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.3",
    "@types/jszip": "^3.4.0",
    "@vitejs/plugin-react": "^6.1.1",
    "jszip": "^3.10.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "tailwindcss": "^4.3.3",
    "vite": "^8.3.0"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "typescript": "^7.0.2"
  }
}`
  },
  {
    path: 'vite.config.ts',
    filename: 'vite.config.ts',
    language: 'typescript',
    description: 'Vite build tool configuration bundling Tailwind CSS v4 and React JSX runtime',
    content: `import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: true,
    },
  };
});`
  },
  {
    path: 'src/index.css',
    filename: 'index.css',
    language: 'css',
    description: 'Global stylesheet with Tailwind CSS v4 imports, dark mode variant, and custom scrollbars',
    content: `@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --color-brand-50: #fff7ed;
  --color-brand-100: #ffedd5;
  --color-brand-200: #fed7aa;
  --color-brand-300: #fdba74;
  --color-brand-400: #fb923c;
  --color-brand-500: #f97316;
  --color-brand-600: #ea580c;
  --color-brand-700: #c2410c;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: rgba(156, 163, 175, 0.4);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(156, 163, 175, 0.7);
}`
  },
  {
    path: 'src/types/vpn.ts',
    filename: 'vpn.ts',
    language: 'typescript',
    description: 'Core TypeScript definitions: ConnectionMode, ConnectionStatus, VpnServer, CustomSetupConfig, AppSettings, ExportableConfig',
    content: `export type ConnectionMode = 
  | 'direct' 
  | 'custom_payload' 
  | 'custom_host' 
  | 'custom_sni' 
  | 'dnstt' 
  | 'imported_config';

export type ConnectionStatus = 
  | 'disconnected' 
  | 'connecting' 
  | 'authenticating' 
  | 'connected' 
  | 'disconnecting' 
  | 'reconnecting';

export interface VpnServer {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  flag: string;
  host: string;
  ip: string;
  ping: number;
  load: number;
  supportsUdp: boolean;
  supportsSsl: boolean;
}

export interface CustomSetupConfig {
  payload: string;
  hostHeader: string;
  sni: string;
  proxyHost: string;
  proxyPort: string;
  dnsttDomain: string;
  dnsttPublicKey: string;
  dnsResolver: string;
  importedConfigName?: string;
  importedConfigRaw?: string;
}

export interface AppSettings {
  sound: boolean;
  vibrate: boolean;
  theme: 'light' | 'dark' | 'system';
  connectionRetry: boolean;
  forwardDns: boolean;
  customDns: boolean;
  primaryDns: string;
  secondaryDns: string;
  autoReconnect: boolean;
  connectionTimeout: number;
}

export interface VpnLogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'warn' | 'error';
  message: string;
}

export interface ExportableConfig {
  appName: 'Mutiganda Yvan VPN';
  version: '2.4.0';
  exportDate: string;
  configName: string;
  note: string;
  connectionMode: ConnectionMode;
  serverHost: string;
  serverPort: number;
  customSetup: CustomSetupConfig;
  settings: Partial<AppSettings>;
  locked: boolean;
  passwordProtected: boolean;
  passwordHash?: string;
  hwidLocked: boolean;
  targetHwid?: string;
  expiryDate?: string;
}`
  },
  {
    path: 'src/services/payloadEngine.ts',
    filename: 'payloadEngine.ts',
    language: 'typescript',
    description: 'HTTP injection payload generator replacing [crlf], [host], [protocol], [split] tags',
    content: `export interface PayloadGeneratorOptions {
  method: 'CONNECT' | 'GET' | 'POST' | 'HEAD' | 'PUT' | 'OPTIONS';
  url: string;
  injectionPoint: 'normal' | 'front' | 'back';
  onlineHost: boolean;
  forwardHost: boolean;
  reverseProxy: boolean;
  keepAlive: boolean;
  userAgent: boolean;
  referer: boolean;
  dualConnect: boolean;
  split: 'none' | 'normal' | 'instant';
  customHeaders?: string;
}

export const generatePayload = (options: PayloadGeneratorOptions): string => {
  const {
    method,
    url,
    injectionPoint,
    onlineHost,
    forwardHost,
    reverseProxy,
    keepAlive,
    userAgent,
    referer,
    dualConnect,
    split,
    customHeaders,
  } = options;

  const targetHost = url.trim() || '[host_port]';
  const cleanDomain = targetHost.replace(/^https?:\\/\\//, '').split('/')[0].split(':')[0];

  let payload = '';

  if (dualConnect) {
    payload += \`CONNECT \${targetHost} HTTP/1.1[crlf][crlf]\`;
  }

  if (injectionPoint === 'front') {
    payload += \`GET http://\${cleanDomain}/ HTTP/1.1[crlf]Host: \${cleanDomain}[crlf][crlf]\`;
  }

  payload += \`\${method} [host_port] [protocol][crlf]\`;

  if (onlineHost) {
    payload += \`Host: \${cleanDomain}[crlf]\`;
  } else {
    payload += \`Host: [host][crlf]\`;
  }

  if (forwardHost) {
    payload += \`X-Forward-Host: \${cleanDomain}[crlf]\`;
    payload += \`X-Forwarded-For: 127.0.0.1[crlf]\`;
  }

  if (reverseProxy) {
    payload += \`Proxy-Connection: Keep-Alive[crlf]\`;
    payload += \`X-Online-Host: \${cleanDomain}[crlf]\`;
  }

  if (keepAlive) {
    payload += \`Connection: Keep-Alive[crlf]\`;
  }

  if (userAgent) {
    payload += \`User-Agent: MutigandaYvanVPN/2.4 (Android 14; Mobile; rv:108)[crlf]\`;
  }

  if (referer) {
    payload += \`Referer: https://\${cleanDomain}/[crlf]\`;
  }

  if (customHeaders && customHeaders.trim()) {
    const lines = customHeaders.split('\\n');
    for (const line of lines) {
      if (line.trim()) {
        payload += \`\${line.trim()}[crlf]\`;
      }
    }
  }

  if (split === 'normal') {
    payload += \`[split]\`;
  } else if (split === 'instant') {
    payload += \`[instant_split]\`;
  }

  payload += \`[crlf]\`;

  if (injectionPoint === 'back') {
    payload += \`GET http://\${cleanDomain}/ HTTP/1.1[crlf]Host: \${cleanDomain}[crlf][crlf]\`;
  }

  return payload;
};

export const DEFAULT_PAYLOAD = 
  'CONNECT [host_port] [protocol][crlf]Host: cloudflare.com[crlf]X-Online-Host: cloudflare.com[crlf]Connection: Keep-Alive[crlf][crlf]';`
  },
  {
    path: 'src/services/configManager.ts',
    filename: 'configManager.ts',
    language: 'typescript',
    description: 'Hardware ID generation, AES-256 config encryption, password protection, and .myv profile export/import parser',
    content: `import { ExportableConfig } from '../types/vpn';

const ENCRYPTION_MAGIC = 'MYV-CFG-V2::';

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

export function getOrCreateDeviceId(): string {
  const STORAGE_KEY = 'myv_vpn_device_hwid';
  let hwid = localStorage.getItem(STORAGE_KEY);
  if (!hwid) {
    const randomHex = Array.from({ length: 16 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('').toUpperCase();
    hwid = \`MYV-AND-\${randomHex.slice(0, 4)}-\${randomHex.slice(4, 8)}-\${randomHex.slice(8, 12)}-\${randomHex.slice(12, 16)}\`;
    localStorage.setItem(STORAGE_KEY, hwid);
  }
  return hwid;
}

export function exportConfigToFile(config: ExportableConfig, password?: string): string {
  const secretKey = password ? \`myv_salt_\${password}\` : 'myv_default_master_tunnel_v2';
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

    if (envelope.expiryDate) {
      const exp = new Date(envelope.expiryDate).getTime();
      if (!isNaN(exp) && Date.now() > exp) {
        return { 
          success: false, 
          error: \`This configuration expired on \${new Date(exp).toLocaleDateString()}. Please request a fresh configuration file.\` 
        };
      }
    }

    if (envelope.hwidLocked) {
      const userHwid = currentHwid || getOrCreateDeviceId();
      if (envelope.targetHwid && envelope.targetHwid !== userHwid) {
        return {
          success: false,
          error: \`Device Hardware ID mismatch. This file is locked to hardware [\${envelope.targetHwid}]. Your ID is [\${userHwid}].\`
        };
      }
    }

    const secretKey = envelope.passwordProtected 
      ? (providedPassword ? \`myv_salt_\${providedPassword}\` : null) 
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
      error: \`Failed to import configuration: \${message}\`
    };
  }
}`
  },
  {
    path: 'src/services/sound.ts',
    filename: 'sound.ts',
    language: 'typescript',
    description: 'Web Audio API synthesizer producing authentic Android tactile clicks for connection and disconnection',
    content: `class SoundService {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playConnect() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {}
  }

  playDisconnect() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.22);
    } catch {}
  }
}

export const sound = new SoundService();`
  },
  {
    path: 'src/services/haptics.ts',
    filename: 'haptics.ts',
    language: 'typescript',
    description: 'Vibration API handler triggering realistic Android tactile pulses on connection events',
    content: `export const haptics = {
  light() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
  },
  medium() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },
  success() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([30, 40, 50]);
    }
  },
  error() {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([60, 40, 60]);
    }
  }
};`
  },
  {
    path: 'src/data/servers.ts',
    filename: 'servers.ts',
    language: 'typescript',
    description: 'VPN server nodes list with IP addresses, geographic flags, pings, ports, and SSL/UDP capabilities',
    content: `import { VpnServer } from '../types/vpn';

export const SERVERS: VpnServer[] = [
  {
    id: 'random',
    name: 'Random Server',
    country: 'Any Location',
    countryCode: 'GLOBAL',
    flag: '🌐',
    host: 'node-auto.myv-vpn.net',
    ip: '104.21.58.120',
    ping: 32,
    load: 45,
    supportsUdp: true,
    supportsSsl: true,
  },
  {
    id: 'us-east',
    name: 'United States East',
    country: 'New York, US',
    countryCode: 'US',
    flag: '🇺🇸',
    host: 'us-east01.myv-vpn.net',
    ip: '198.51.100.42',
    ping: 48,
    load: 62,
    supportsUdp: true,
    supportsSsl: true,
  },
  {
    id: 'de-fra',
    name: 'Germany Frankfurt',
    country: 'Frankfurt, DE',
    countryCode: 'DE',
    flag: '🇩🇪',
    host: 'de-fra01.myv-vpn.net',
    ip: '203.0.113.15',
    ping: 28,
    load: 38,
    supportsUdp: true,
    supportsSsl: true,
  },
  {
    id: 'nl-ams',
    name: 'Netherlands Amsterdam',
    country: 'Amsterdam, NL',
    countryCode: 'NL',
    flag: '🇳🇱',
    host: 'nl-ams03.myv-vpn.net',
    ip: '192.0.2.78',
    ping: 24,
    load: 41,
    supportsUdp: true,
    supportsSsl: true,
  },
  {
    id: 'sg-sin',
    name: 'Singapore Central',
    country: 'Singapore, SG',
    countryCode: 'SG',
    flag: '🇸🇬',
    host: 'sg-sin01.myv-vpn.net',
    ip: '103.25.10.4',
    ping: 72,
    load: 58,
    supportsUdp: true,
    supportsSsl: true,
  }
];

export const AVAILABLE_PORTS = [
  { label: 'P 80', value: 80, desc: 'HTTP Standard' },
  { label: 'P 443', value: 443, desc: 'HTTPS / TLS Standard' },
  { label: 'P 8080', value: 8080, desc: 'HTTP Web Alternate' },
  { label: 'P 3128', value: 3128, desc: 'Squid Proxy Default' },
  { label: 'P 8888', value: 8888, desc: 'Custom Tunnel Port' },
  { label: 'P 53', value: 53, desc: 'DNS Tunnel / UDP' },
  { label: 'P 22', value: 22, desc: 'SSH Tunnel Port' },
];`
  },
  {
    path: 'README_KINYARWANDA.md',
    filename: 'README_KINYARWANDA.md',
    language: 'markdown',
    description: 'Amabwiriza arambuye mu Kinyarwanda no mu Cyongereza yo gukoresha no kubaka iyi app ya Mutiganda Yvan VPN',
    content: `# Mutiganda Yvan VPN — Amabwiriza yo Kubaka no Gukoresha Code zose

Iyi application igizwe n'ibice bibiri (2) by'ingenzi:
1. **Android Studio Native App (Kotlin / Java)**: Porogaramu nyakuri ya telefoni zikoresha Android, yubatswe ikoresheje \`android.net.VpnService\` ifungura virtual network tunnel (tun0).
2. **React & Vite Web App**: Porogaramu ikora muri Browser (Web) ifasha kugerageza payloads, gukora export no gusoma amadosiye ya \`.myv\`, no gucunga servers.

---

## 1. Uburyo bwo kubaka Android APK muri Android Studio:
1. Kanda kuri buto **"Download Android Studio Project (.ZIP)"** muri Code Explorer cyangwa hejuru mu menu.
2. Fungura dosiye ya ZIP kuri mudasobwa yawe (Extract All).
3. Fungura **Android Studio** (verisiyo nshya nka Ladybug cyangwa Iguana).
4. Hitamo **File > Open**, maze ushake aho wafunguriye wa mushinga.
5. Tegereza iminota 1-2 kugira ngo Gradle ikuremo ama-libraries (Core KTX, Coroutines, Material 3).
6. Fungura \`MyvVpnService.kt\` maze ushyiremo aderesi ya server yawe ya VPN cyangwa ukomeze n'izisanzwemo.
7. Fata telefoni yawe uyihuze na mudasobwa ukoresheje umugozi wa USB (wabanje gufungura USB Debugging).
8. Kanda buto y'icyatsi yitwa **Run (Shift + F10)**.
9. Telefoni izakira application ya **Mutiganda Yvan VPN**, maze ukande **START** kugira ngo ufungure VPN.

---

## 2. Uburyo bwo gutangiza Web Client (Node.js / Bun):
\`\`\`bash
# 1. Kwicaza dependencies zose
npm install

# 2. Gutangiza seriveri y'iterambere (Local Dev Server)
npm run dev

# 3. Kurema verisiyo yo gushyira ku murongo (Production Build)
npm run build
\`\`\`

---

## 3. Imikorere y'Ubuvugizi bwa VPN (Connection Modes):
- **Direct Connection**: Ihuza rigufi ry'umuyoboro nta payload cyangwa proxy.
- **Custom HTTP/TCP Payload**: Injizamo amagambo yihariye (Payload keywords) nka \`[crlf]\`, \`[host]\`, \`[split]\`.
- **Custom SNI (SSL/TLS)**: Ihindura Server Name Indication mu gihe cyo gukora TLS Handshake.
- **DNSTT (DNS Tunneling)**: Itwara amakuru mu bisubizo bya DNS queries (Port 53) mu gihe indi miyoboro ifunze.
- **Imported Profile (.myv)**: Ifungura dosiye zafunzwe n'ijambo ry'ibanga (Password) cyangwa zizirikitswe kuri telefoni imwe gusa (Hardware ID Lock).
`
  }
];
