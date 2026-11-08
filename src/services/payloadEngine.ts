export interface PayloadGeneratorOptions {
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
  const cleanDomain = targetHost.replace(/^https?:\/\//, '').split('/')[0].split(':')[0];

  let payload = '';

  if (dualConnect) {
    payload += `CONNECT ${targetHost} HTTP/1.1[crlf][crlf]`;
  }

  if (injectionPoint === 'front') {
    payload += `GET http://${cleanDomain}/ HTTP/1.1[crlf]Host: ${cleanDomain}[crlf][crlf]`;
  }

  // Primary request line
  payload += `${method} [host_port] [protocol][crlf]`;

  // Host header variations
  if (onlineHost) {
    payload += `Host: ${cleanDomain}[crlf]`;
  } else {
    payload += `Host: [host][crlf]`;
  }

  if (forwardHost) {
    payload += `X-Forward-Host: ${cleanDomain}[crlf]`;
    payload += `X-Forwarded-For: 127.0.0.1[crlf]`;
  }

  if (reverseProxy) {
    payload += `Proxy-Connection: Keep-Alive[crlf]`;
    payload += `X-Online-Host: ${cleanDomain}[crlf]`;
  }

  if (keepAlive) {
    payload += `Connection: Keep-Alive[crlf]`;
  }

  if (userAgent) {
    payload += `User-Agent: MutigandaYvanVPN/2.4 (Android 14; Mobile; rv:108)[crlf]`;
  }

  if (referer) {
    payload += `Referer: https://${cleanDomain}/[crlf]`;
  }

  if (customHeaders && customHeaders.trim()) {
    const lines = customHeaders.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        payload += `${line.trim()}[crlf]`;
      }
    }
  }

  if (split === 'normal') {
    payload += `[split]`;
  } else if (split === 'instant') {
    payload += `[instant_split]`;
  }

  payload += `[crlf]`;

  if (injectionPoint === 'back') {
    payload += `GET http://${cleanDomain}/ HTTP/1.1[crlf]Host: ${cleanDomain}[crlf][crlf]`;
  }

  return payload;
};

export const DEFAULT_PAYLOAD = 
  'CONNECT [host_port] [protocol][crlf]Host: cloudflare.com[crlf]X-Online-Host: cloudflare.com[crlf]Connection: Keep-Alive[crlf][crlf]';
