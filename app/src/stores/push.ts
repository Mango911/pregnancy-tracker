import { defineStore } from 'pinia';
import { ref } from 'vue';
import * as pushApi from '@/api/push';

export const usePushStore = defineStore('push', () => {
  const isSupported = ref(false);
  const isSubscribed = ref(false);
  const subscription = ref<PushSubscription | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  function checkSupport() {
    isSupported.value = 'serviceWorker' in navigator && 'PushManager' in window;
    return isSupported.value;
  }

  async function subscribe() {
    if (!checkSupport()) {
      error.value = '您的浏览器不支持推送通知';
      return false;
    }

    loading.value = true;
    error.value = null;

    try {
      // 请求通知权限
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        error.value = '需要通知权限才能启用提醒';
        return false;
      }

      // 获取 Service Worker 注册
      const registration = await navigator.serviceWorker.ready;

      // 获取 VAPID 公钥
      const { publicKey } = await pushApi.getVapidPublicKey();

      // 订阅推送
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      // 发送订阅信息到后端
      await pushApi.subscribeToPush(pushSubscription);

      subscription.value = pushSubscription;
      isSubscribed.value = true;
      localStorage.setItem('push_subscribed', 'true');

      return true;
    } catch (e: any) {
      error.value = e.message;
      console.error('Push subscription error:', e);
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function unsubscribe() {
    if (!subscription.value) return;

    loading.value = true;
    error.value = null;

    try {
      await subscription.value.unsubscribe();
      await pushApi.unsubscribeFromPush(subscription.value.endpoint);

      subscription.value = null;
      isSubscribed.value = false;
      localStorage.removeItem('push_subscribed');

      return true;
    } catch (e: any) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function testNotification() {
    loading.value = true;
    error.value = null;

    try {
      await pushApi.testPushNotification();
      return true;
    } catch (e: any) {
      error.value = e.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function checkSubscription() {
    if (!checkSupport()) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const pushSubscription = await registration.pushManager.getSubscription();

      if (pushSubscription) {
        subscription.value = pushSubscription;
        isSubscribed.value = true;
      } else {
        isSubscribed.value = false;
        localStorage.removeItem('push_subscribed');
      }
    } catch (e: any) {
      console.error('Check subscription error:', e);
    }
  }

  return {
    isSupported,
    isSubscribed,
    subscription,
    loading,
    error,
    checkSupport,
    subscribe,
    unsubscribe,
    testNotification,
    checkSubscription,
  };
});

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
