const staticDevTFF = "dev-time-for-feathers-v1"
const assets = [
    "./",
    "./index.html",
    "./app.js"
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
            caches.open(staticDevTFF).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener('activate', function(event){
    console.log("service worker activated", event)
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})