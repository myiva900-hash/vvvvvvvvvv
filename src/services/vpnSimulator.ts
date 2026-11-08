import { ConnectionMode, ConnectionStatus, CustomSetupConfig, VpnLogEntry, VpnServer } from '../types/vpn';
import { soundService } from './sound';
import { triggerHaptic } from './haptics';

export interface VpnStats {
  uploadBytes: number;
  downloadBytes: number;
  uploadSpeed: number; // bytes/sec
  downloadSpeed: number; // bytes/sec
  connectedSeconds: number;
  assignedIp: string;
}

export type LogListener = (entry: VpnLogEntry) => void;
export type StatusListener = (status: ConnectionStatus, stats: VpnStats) => void;

class VpnSimulatorService {
  private status: ConnectionStatus = 'disconnected';
  private stats: VpnStats = {
    uploadBytes: 0,
    downloadBytes: 0,
    uploadSpeed: 0,
    downloadSpeed: 0,
    connectedSeconds: 0,
    assignedIp: '10.8.0.2',
  };

  private timerInterval: NodeJS.Timeout | null = null;
  private trafficInterval: NodeJS.Timeout | null = null;
  private logListeners: Set<LogListener> = new Set();
  private statusListeners: Set<StatusListener> = new Set();

  public subscribeLogs(listener: LogListener) {
    this.logListeners.add(listener);
    return () => this.logListeners.delete(listener);
  }

  public subscribeStatus(listener: StatusListener) {
    this.statusListeners.add(listener);
    // Send immediate state
    listener(this.status, { ...this.stats });
    return () => this.statusListeners.delete(listener);
  }

  private emitLog(level: 'info' | 'success' | 'warn' | 'error', message: string) {
    const entry: VpnLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
      level,
      message,
    };
    this.logListeners.forEach(listener => listener(entry));
  }

  private setStatus(newStatus: ConnectionStatus) {
    this.status = newStatus;
    this.statusListeners.forEach(listener => listener(this.status, { ...this.stats }));
  }

  public getStatus(): ConnectionStatus {
    return this.status;
  }

  public getStats(): VpnStats {
    return { ...this.stats };
  }

  public async startConnection(
    server: VpnServer,
    port: number,
    mode: ConnectionMode,
    customSetup: CustomSetupConfig,
    settings: { sound: boolean; vibrate: boolean; primaryDns: string; forwardDns: boolean }
  ) {
    if (this.status === 'connected' || this.status === 'connecting') {
      return;
    }

    this.setStatus('connecting');
    this.emitLog('info', `[System] Mutiganda Yvan VPN Core v2.4.0 started`);
    this.emitLog('info', `[VPN] Initializing Android VpnService interface...`);
    this.emitLog('info', `[Config] Target Node: ${server.name} (${server.country}) -> ${server.host}:${port}`);
    this.emitLog('info', `[DNS] Forward DNS: ${settings.forwardDns ? 'Enabled' : 'Disabled'} | Resolver: ${settings.primaryDns || '1.1.1.1'}`);

    await new Promise(r => setTimeout(r, 450));

    // Phase 2: Socket creation & protection
    this.setStatus('authenticating');
    this.emitLog('info', `[Net] Allocating client socket fd and invoking VpnService.protect()...`);
    this.emitLog('info', `[DNS] Resolving server IP for ${server.host} -> ${server.ip}`);

    await new Promise(r => setTimeout(r, 550));

    // Phase 3: Mode-specific handshake
    switch (mode) {
      case 'custom_payload':
        this.emitLog('info', `[Payload] Injecting HTTP/TCP Header to remote gateway...`);
        const snippet = (customSetup.payload || '').slice(0, 48).replace(/\[crlf\]/g, ' ');
        this.emitLog('info', `[Payload Raw] ${snippet}...`);
        await new Promise(r => setTimeout(r, 400));
        this.emitLog('success', `[Proxy] Received HTTP/1.1 200 Connection Established`);
        break;

      case 'custom_sni':
        const targetSni = customSetup.sni || 'edge.cloudflare.com';
        this.emitLog('info', `[TLS] Initiating SSL/TLS handshake with SNI: ${targetSni}`);
        await new Promise(r => setTimeout(r, 400));
        this.emitLog('success', `[TLS] Handshake complete: TLSv1.3 / AES_256_GCM_SHA384`);
        break;

      case 'custom_host':
        const host = customSetup.hostHeader || 'cdn.cloudflare.net';
        this.emitLog('info', `[HTTP] Transmitting HTTP CONNECT proxy header with Host: ${host}`);
        await new Promise(r => setTimeout(r, 350));
        this.emitLog('success', `[HTTP] HTTP/1.1 200 OK`);
        break;

      case 'dnstt':
        this.emitLog('info', `[DNSTT] Initializing DNS Tunnel over UDP 53 -> ${customSetup.dnsttDomain || 't.myv-dns.org'}`);
        await new Promise(r => setTimeout(r, 400));
        this.emitLog('success', `[DNSTT] Cryptographic session key established`);
        break;

      case 'imported_config':
        this.emitLog('info', `[Import] Reading active profile: ${customSetup.importedConfigName || 'myv_secure.myv'}`);
        await new Promise(r => setTimeout(r, 350));
        this.emitLog('success', `[Import] Decrypted session parameters verified`);
        break;

      case 'direct':
      default:
        this.emitLog('info', `[Direct] TCP 3-Way Handshake with ${server.ip}:${port}...`);
        await new Promise(r => setTimeout(r, 350));
        this.emitLog('success', `[Direct] Remote socket synchronized (SYN-ACK / ACK)`);
        break;
    }

    // Phase 4: Virtual TUN allocation
    await new Promise(r => setTimeout(r, 300));
    this.emitLog('info', `[TUN] Builder.addAddress("10.8.0.2", 24).addRoute("0.0.0.0", 0).establish()`);
    this.emitLog('success', `[TUN] Virtual interface tun0 created successfully (MTU: 1500)`);
    this.emitLog('success', `[VPN] *** MUTIGANDA YVAN VPN CONNECTED ***`);

    // Feedback
    if (settings.sound) {
      soundService.playConnect();
    }
    if (settings.vibrate) {
      triggerHaptic([50, 80, 50]);
    }

    // Set connected
    this.stats.connectedSeconds = 0;
    this.setStatus('connected');

    // Start timer & traffic simulation
    this.startTrafficSimulation();
  }

  private startTrafficSimulation() {
    this.stopIntervals();

    this.timerInterval = setInterval(() => {
      this.stats.connectedSeconds += 1;
      this.statusListeners.forEach(listener => listener(this.status, { ...this.stats }));
    }, 1000);

    this.trafficInterval = setInterval(() => {
      // Realistic random transfer speed
      const upDelta = Math.floor(Math.random() * 32000) + 1200; // ~1-32 KB/s
      const downDelta = Math.floor(Math.random() * 98000) + 4500; // ~4-100 KB/s

      this.stats.uploadBytes += upDelta;
      this.stats.downloadBytes += downDelta;
      this.stats.uploadSpeed = upDelta;
      this.stats.downloadSpeed = downDelta;

      this.statusListeners.forEach(listener => listener(this.status, { ...this.stats }));
    }, 1000);
  }

  public async stopConnection(settings: { sound: boolean; vibrate: boolean }) {
    if (this.status === 'disconnected' || this.status === 'disconnecting') {
      return;
    }

    this.setStatus('disconnecting');
    this.emitLog('warn', `[VPN] Disconnect signal received. Tearing down tunnel...`);
    this.stopIntervals();

    await new Promise(r => setTimeout(r, 400));

    this.emitLog('info', `[TUN] Closing tun0 file descriptor and releasing routes...`);
    this.emitLog('info', `[Net] Upstream socket disconnected cleanly`);
    this.emitLog('info', `[Summary] Total Sent: ${this.formatBytes(this.stats.uploadBytes)} | Total Received: ${this.formatBytes(this.stats.downloadBytes)}`);
    this.emitLog('info', `[VPN] Mutiganda Yvan VPN disconnected`);

    if (settings.sound) {
      soundService.playDisconnect();
    }
    if (settings.vibrate) {
      triggerHaptic(40);
    }

    this.stats.uploadSpeed = 0;
    this.stats.downloadSpeed = 0;
    this.setStatus('disconnected');
  }

  private stopIntervals() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.trafficInterval) {
      clearInterval(this.trafficInterval);
      this.trafficInterval = null;
    }
  }

  public formatBytes(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

export const vpnSimulator = new VpnSimulatorService();
