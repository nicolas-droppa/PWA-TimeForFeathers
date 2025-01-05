const staticDevTFF = "dev-time-for-feathers-v1"
const basePath = self.location.pathname.includes('/');
const assets = [
    `${basePath}//`,
    `${basePath}/assets/fonts/Pixel.ttf`,
    `${basePath}/assets/images`,
    `${basePath}/index.html`,
    `${basePath}/scripts/app/app.js`,
    `${basePath}/styles/style.css`
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