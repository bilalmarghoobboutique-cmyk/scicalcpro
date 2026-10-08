// ============================================
// SciCalcPro Service Worker (PWA — Offline Support)
// By Bilal Marghoob Creations
// ============================================

const CACHE_NAME = 'scicalcpro-v1'
const OFFLINE_URL = '/offline.html'

// Files to cache on install
const urlsToCache = [
  '/',
  '/index.html',
  '/age-calculator.html',
  '/profit-calculator.html',
  '/area-calculator.html',
  '/time-calculator.html',
  '/engineering-calculator.html',
  '/gold-silver-calculator.html',
  '/blog/',
  '/blog/how-to-use-scientific-calculator.html',
  '/blog/deg-vs-rad.html',
  '/blog/calculator-tricks.html',
  '/blog/how-to-calculate-age.html',
  '/blog/profit-vs-markup.html',
  '/blog/area-formulas-guide.html',
  '/blog/time-calculation-guide.html',
  '/blog/ohms-law-explained.html',
  '/blog/gold-rate-calculation.html',
  '/blog/top-10-free-calculators.html',
  '/manifest.json',
  OFFLINE_URL
]

// ============================================
// INSTALL — Cache all files
// ============================================
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker: Installing...')
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching files...')
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('⚠️ Some files failed to cache:', err)
      })
    })
  )
  self.skipWaiting()
})

// ============================================
// ACTIVATE — Clean old caches
// ============================================
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Activated')
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// ============================================
// FETCH — Cache first, then network
// ============================================
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return

  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return

  // Skip external requests (ads, analytics, etc.)
  if (!event.request.url.startsWith(self.location.origin)) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse
      }

      // Otherwise fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Don't cache non-successful responses
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse
        }

        // Cache the new response
        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return networkResponse
      }).catch(() => {
        // If offline and page not cached, show offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL)
        }
      })
    })
  )
})

console.log('✅ SciCalcPro Service Worker loaded')