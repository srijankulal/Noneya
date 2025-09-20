// Service Worker for Push Notifications
self.addEventListener('push', function(event) {
  console.log('Push event received:', event);

  if (event.data) {
    try {
      const data = event.data.json();
      
      const options = {
        body: data.body || data.message || 'You have a new cryptocurrency alert!',
        icon: '/placeholder-logo.png',
        badge: '/placeholder-logo.png',
        tag: data.tag || 'crypto-alert',
        requireInteraction: true,
        actions: [
          {
            action: 'view',
            title: 'View Alert'
          },
          {
            action: 'dismiss',
            title: 'Dismiss'
          }
        ],
        data: {
          url: data.url || '/',
          ...data
        }
      };

      event.waitUntil(
        self.registration.showNotification(data.title || 'Crypto Alert', options)
      );
    } catch (error) {
      console.error('Error processing push data:', error);
      
      // Fallback notification
      event.waitUntil(
        self.registration.showNotification('Crypto Alert', {
          body: 'You have a new cryptocurrency alert!',
          icon: '/placeholder-logo.png',
          badge: '/placeholder-logo.png',
          tag: 'crypto-alert-fallback'
        })
      );
    }
  }
});

self.addEventListener('notificationclick', function(event) {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Open the app or focus existing tab
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(function(clientList) {
        const url = event.notification.data?.url || '/';
        
        // Check if there's already a window/tab open with the app
        for (let i = 0; i < clientList.length; i++) {
          const client = clientList[i];
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no existing window, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
    );
  }
  // If action is 'dismiss', just close the notification (already done above)
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification closed:', event);
  // Track notification dismissal if needed
});

// Handle service worker installation
self.addEventListener('install', function(event) {
  console.log('Service Worker installing...');
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Handle service worker activation
self.addEventListener('activate', function(event) {
  console.log('Service Worker activating...');
  // Claim all clients to start working immediately
  event.waitUntil(self.clients.claim());
});
