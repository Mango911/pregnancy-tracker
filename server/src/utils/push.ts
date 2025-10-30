// Web Push 实现（使用 Web Crypto API）
export async function sendPushNotification(
  subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  },
  payload: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
  },
  env: any
): Promise<void> {
  const vapidKeys = {
    publicKey: env.VAPID_PUBLIC_KEY,
    privateKey: env.VAPID_PRIVATE_KEY,
    subject: env.VAPID_EMAIL,
  };

  // 准备 payload
  const payloadString = JSON.stringify(payload);

  // 使用 Web Crypto API 进行加密和签名
  const { headers, body } = await prepareWebPushRequest(
    subscription,
    payloadString,
    vapidKeys
  );

  // 发送推送
  const response = await fetch(subscription.endpoint, {
    method: 'POST',
    headers,
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Push failed: ${response.status} ${text}`);
  }
}

async function prepareWebPushRequest(
  subscription: any,
  payload: string,
  vapidKeys: any
) {
  // 这是一个简化版本
  // 完整的 Web Push 实现需要 ECDH、AES-GCM 等加密算法
  // 在生产环境中，建议使用 web-push 库或类似的实现

  const headers: Record<string, string> = {
    'Content-Type': 'application/octet-stream',
    'Content-Encoding': 'aes128gcm',
    TTL: '86400',
  };

  // 添加 VAPID 认证
  const vapidHeader = await generateVAPIDAuthHeader(
    subscription.endpoint,
    vapidKeys
  );
  headers['Authorization'] = `vapid t=${vapidHeader.token}, k=${vapidKeys.publicKey}`;

  // 加密 payload
  const encryptedPayload = await encryptPayload(
    payload,
    subscription.keys.p256dh,
    subscription.keys.auth
  );

  return {
    headers,
    body: encryptedPayload,
  };
}

async function generateVAPIDAuthHeader(endpoint: string, vapidKeys: any) {
  // 简化的 VAPID JWT 实现
  const url = new URL(endpoint);
  const audience = `${url.protocol}//${url.host}`;

  const header = {
    typ: 'JWT',
    alg: 'ES256',
  };

  const payload = {
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 60 * 60, // 12 hours
    sub: vapidKeys.subject,
  };

  // 注意：这里需要使用 ES256 签名，这是简化版本
  // 实际实现需要使用 ECDSA P-256 签名
  const token = btoa(JSON.stringify(header)) + '.' + btoa(JSON.stringify(payload));

  return { token };
}

async function encryptPayload(
  payload: string,
  clientPublicKey: string,
  authSecret: string
): Promise<ArrayBuffer> {
  // 这是一个占位实现
  // 完整的实现需要：
  // 1. 使用 ECDH 生成共享密钥
  // 2. 使用 HKDF 派生加密密钥
  // 3. 使用 AES-128-GCM 加密 payload

  // 由于 Cloudflare Workers 环境限制，建议使用简化的推送实现
  // 或者使用第三方服务如 OneSignal、Firebase Cloud Messaging

  const encoder = new TextEncoder();
  return encoder.encode(payload).buffer;
}

// 生成 VAPID 密钥对的辅助函数（用于首次设置）
export async function generateVAPIDKeys() {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: 'ECDSA',
      namedCurve: 'P-256',
    },
    true,
    ['sign', 'verify']
  );

  const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: arrayBufferToBase64(publicKey),
    privateKey: arrayBufferToBase64(privateKey),
  };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
