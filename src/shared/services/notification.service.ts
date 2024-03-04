import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor() {}

  sendNotification(title: string, options: PushNotificationOptions): void {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.error(
        'Service Worker or Push Notifications are not supported in this browser'
      );
      return;
    }

    navigator.serviceWorker.ready
      .then((registration) => {
        registration.showNotification(title, options);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
}

interface PushNotificationOptions {
  body: string;
  icon?: string;
  data?: any;
}
