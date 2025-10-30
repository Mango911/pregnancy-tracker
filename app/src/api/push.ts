import { apiRequest, API_BASE_URL } from '@/api/config';

export async function getVapidPublicKey(): Promise<{ publicKey: string }> {
  return apiRequest('/api/vapid-public-key');
}

export async function subscribeToPush(
  subscription: PushSubscription
): Promise<{ success: boolean }> {
  return apiRequest('/api/push/subscribe', {
    method: 'POST',
    body: JSON.stringify({
      subscription: {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: arrayBufferToBase64(subscription.getKey('p256dh')!),
          auth: arrayBufferToBase64(subscription.getKey('auth')!),
        },
      },
    }),
  });
}

export async function unsubscribeFromPush(endpoint: string): Promise<{ success: boolean }> {
  return apiRequest('/api/push/subscribe', {
    method: 'DELETE',
    body: JSON.stringify({ endpoint }),
  });
}

export async function testPushNotification(): Promise<{ success: boolean; sent: number; total: number }> {
  return apiRequest('/api/push/test', {
    method: 'POST',
  });
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
