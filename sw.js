// 3dMtrl offline support. Version changes on every build so updates arrive.
const CACHE = '3dmtrl-5cfb3811ea';
const SHELL = ["./", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/favicon-32.png", "vendor/three/build/three.min.js", "vendor/three/examples/js/controls/OrbitControls.js", "vendor/three/examples/js/exporters/GLTFExporter.js", "vendor/three/examples/js/loaders/GLTFLoader.js", "vendor/three/examples/js/environments/RoomEnvironment.js", "vendor/three/examples/js/objects/Sky.js", "vendor/three/examples/js/lights/RectAreaLightUniformsLib.js", "vendor/three/examples/js/shaders/CopyShader.js", "vendor/three/examples/js/math/SimplexNoise.js", "vendor/three/examples/js/shaders/SSAOShader.js", "vendor/three/examples/js/shaders/GammaCorrectionShader.js", "vendor/three/examples/js/postprocessing/EffectComposer.js", "vendor/three/examples/js/postprocessing/RenderPass.js", "vendor/three/examples/js/postprocessing/ShaderPass.js", "vendor/three/examples/js/postprocessing/SSAOPass.js"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('3dmtrl-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if(r.method !== 'GET') return;
  const url = new URL(r.url);
  // the page itself: fresh when online, cached when offline
  if(r.mode === 'navigate'){ e.respondWith(fetch(r).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put('./', cp)); return res; }).catch(() => caches.match('./'))); return; }
  // fonts and app files: cached first, refreshed in the background
  if(url.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.open(CACHE).then(c => c.match(r).then(hit => { const net = fetch(r).then(res => { if(res.ok || res.type === 'opaque') c.put(r, res.clone()); return res; }).catch(() => hit); return hit || net; })));
  }
});
