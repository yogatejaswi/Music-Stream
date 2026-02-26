// Service Worker for Music Stream PWA
const CACHE_NAME = 'music-stream-v1';
const STATIC_CACHE = 'music-stream-static-v1';
const DYNAMIC_CACHE = 'music-stream-dynamic-v1';
const AUDIO_CACHE = 'music-stream-audio-v1';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/login',
  '/register',
  '/dashboard',
  '/search',
  '/library',
  '/charts',
  '/history',
  '/settings',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker: Static files cached');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== AUDIO_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle audio files
  if (request.url.includes('audio') || request.headers.get('accept')?.includes('audio')) {
    event.respondWith(handleAudioRequest(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  // Handle other requests
  event.respondWith(handleOtherRequests(request));
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for specific endpoints
    if (request.url.includes('/api/songs')) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Offline mode - limited functionality',
        songs: []
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Handle audio requests with cache-first strategy
async function handleAudioRequest(request) {
  try {
    // Check cache first for audio files
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache audio files for offline use
    if (networkResponse.ok) {
      const cache = await caches.open(AUDIO_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return a placeholder audio response when offline
    return new Response('', {
      status: 404,
      statusText: 'Audio not available offline'
    });
  }
}

// Handle navigation requests
async function handleNavigationRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    // Fallback to cached pages
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fallback to offline page
    const offlinePage = await caches.match('/');
    return offlinePage || new Response('Offline', { status: 200 });
  }
}

// Handle other requests (images, CSS, JS)
async function handleOtherRequests(request) {
  try {
    // Check cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return cached version or fail gracefully
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Resource not available offline', {
      status: 404
    });
  }
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'sync-play-history') {
    event.waitUntil(syncPlayHistory());
  }
  
  if (event.tag === 'sync-user-actions') {
    event.waitUntil(syncUserActions());
  }
});

// Sync play history when back online
async function syncPlayHistory() {
  try {
    // Get stored play history from IndexedDB
    const playHistory = await getStoredPlayHistory();
    
    if (playHistory.length > 0) {
      // Send to server
      await fetch('/api/history/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: playHistory })
      });
      
      // Clear stored history
      await clearStoredPlayHistory();
      console.log('Service Worker: Play history synced');
    }
  } catch (error) {
    console.error('Service Worker: Error syncing play history', error);
  }
}

// Sync user actions (likes, playlist changes, etc.)
async function syncUserActions() {
  try {
    const actions = await getStoredUserActions();
    
    for (const action of actions) {
      try {
        await fetch(action.endpoint, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(action.data)
        });
      } catch (error) {
        console.error('Service Worker: Error syncing action', action, error);
      }
    }
    
    await clearStoredUserActions();
    console.log('Service Worker: User actions synced');
  } catch (error) {
    console.error('Service Worker: Error syncing user actions', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: 'New music recommendations available!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      url: '/dashboard'
    },
    actions: [
      {
        action: 'open',
        title: 'Open App',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/icon-72x72.png'
      }
    ]
  };
  
  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
    options.data = data.data || options.data;
  }
  
  event.waitUntil(
    self.registration.showNotification('Music Stream', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'close') {
    return;
  }
  
  const url = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if app is already open
        for (const client of clientList) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});

// Utility functions for IndexedDB operations
async function getStoredPlayHistory() {
  // Implement IndexedDB operations
  return [];
}

async function clearStoredPlayHistory() {
  // Implement IndexedDB operations
}

async function getStoredUserActions() {
  // Implement IndexedDB operations
  return [];
}

async function clearStoredUserActions() {
  // Implement IndexedDB operations
}

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});