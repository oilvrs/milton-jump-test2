const CACHE_NAME = 'milton-jump-v1'

const urlsToCache = [
  'index.html',

  // JS Components
  'js/components/milton-jump.js',
  'js/components/high-score.js',

  // Images from HTML attributes
  'images/testavatar3.png',
  'images/ny1.png',
  'images/nytest2UT.png',
  'images/jumptunga.png',
  'images/newcloud.png',
  'images/stockholmwater1.png',
  'images/stockholmwater2.png',
  'images/newlogo.png',
  'images/newlogo2.png',
  'images/eatavatar.png',
  'images/bone.png',
  'images/trashcan.png',

  // Original image list (kept in full)
 
  'images/bush.png',
  'images/cloud.png',
  'images/mountains1.png',
  'images/mountains2.png',
  'images/nighttree.png',
  'images/star1.png',
  'images/pyramid1.png',
  'images/pyramid2.png',
  'images/cactus.png',

  // Audio used in component
  'audio/milton-jump-menu.mp3',
  'audio/milton-jump-main.mp3',
  'audio/miltonbark.mp3',
  'audio/eat.mp3',

]

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  )
})

// Fetch event
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  )
})

// Cleanup old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    )
  )
})
