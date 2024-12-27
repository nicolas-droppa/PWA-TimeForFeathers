const staticDevTFF = "dev-time-for-feathers-v1"
const assets = [
    "./",
    "./assets/fonts/Pixel.ttf",
    "./assets/images",
    "./index.html",
    "./scripts/app/app.js",
    "./styles/style.css"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
            caches.open(staticDevTFF).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener('activate', function(event){
    const cacheWhitelist = [staticDevTFF];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    console.log("service worker activated", event)
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})