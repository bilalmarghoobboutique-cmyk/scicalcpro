// ============================================
// SciCalcPro Service Worker (PWA — Offline)
// By Bilal Marghoob Creations
// ============================================

const CACHE_NAME = 'scicalcpro-v2'
const OFFLINE_URL = '/offline.html'

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

// INSTALL
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('⚠️ Some files failed to cache:', err)
      })
    })
  )
  self.skipWaiting()
})

// ACTIVATE
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
  self.clients.claim()
})

// FETCH
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return
  if (!event.request.url.startsWith('http')) return
  if (!event.request.url.startsWith(self.location.origin)) return

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse
        }

        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache)
        })

        return networkResponse
      }).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL)
        }
      })
    })
  )
})

console.log('✅ SciCalcPro Service Worker v2 loaded')