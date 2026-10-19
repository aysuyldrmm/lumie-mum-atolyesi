import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// `npm run dev` ve `npm run preview` sırasında api/ klasöründeki route'ları
// çalıştırır; yayında aynı dosyaları Vercel çalıştırır. Route'lar Web standardı
// `export function POST(request)` biçimindedir.
function devApi() {
  // Geliştirmede değişiklikler anında yansısın diye route'ları Vite yükler;
  // önizlemede derlenmiş site kullanıldığı için doğrudan Node ile yüklenir.
  const apiMiddleware = (loadRoute, fixStacktrace) => async (req, res, next) => {
    const name = req.url.split('?')[0].replace(/^\//, '')
    // `_lib` gibi yardımcı dosyalar route değildir.
    if (!/^[a-z][a-z-]*$/.test(name)) return next()

    let route
    try {
      route = await loadRoute(name)
    } catch {
      return next()
    }
    const handler = route[req.method]
    if (typeof handler !== 'function') {
      res.statusCode = 405
      res.setHeader('Allow', Object.keys(route).filter((key) => /^[A-Z]+$/.test(key)).join(', '))
      return res.end()
    }

    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    // Vercel'deki gibi IP başlıklarını sunucu doldurur; ziyaretçinin gönderdiği değer geçmez.
    const ip = req.socket.remoteAddress ?? 'bilinmiyor'
    const request = new Request(`http://${req.headers.host}${req.url}`, {
      method: req.method,
      headers: { ...req.headers, 'x-real-ip': ip, 'x-forwarded-for': ip },
      body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
    })

    try {
      const response = await handler(request)
      res.statusCode = response.status
      response.headers.forEach((value, key) => res.setHeader(key, value))
      res.end(Buffer.from(await response.arrayBuffer()))
    } catch (error) {
      fixStacktrace?.(error)
      console.error(error)
      res.statusCode = 500
      res.end()
    }
  }

  const routeFileUrl = (name) => new URL(`./api/${name}.js`, import.meta.url).href

  return {
    name: 'lumie-dev-api',
    configureServer(server) {
      server.middlewares.use(
        '/api',
        apiMiddleware(
          (name) => server.ssrLoadModule(`/api/${name}.js`),
          (error) => server.ssrFixStacktrace(error),
        ),
      )
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api', apiMiddleware((name) => import(routeFileUrl(name))))
    },
  }
}

// Güvenlik başlıklarının tek kaynağı vercel.json'dır. `npm run preview` da aynı
// başlıkları gönderir, böylece yayındaki davranış yerelde denenebilir. Geliştirme
// sunucusuna uygulanmaz: Vite'ın anlık yenileme betikleri bu kurallara takılır.
const securityHeaders = Object.fromEntries(
  JSON.parse(readFileSync(new URL('./vercel.json', import.meta.url), 'utf8'))
    .headers.find((rule) => rule.source === '/(.*)')
    .headers.map(({ key, value }) => [key, value]),
)

export default defineConfig(({ mode }) => {
  // Bu değişkenlerin VITE_ öneki yok: Vite onları tarayıcı koduna koymaz, yalnızca
  // geliştirme sunucusundaki API route'ları okur. Terminalden verilen değer önceliklidir.
  const env = loadEnv(mode, process.cwd(), '')
  for (const name of [
    'WEBHOOK_URL',
    'KV_REST_API_URL',
    'KV_REST_API_TOKEN',
    'UPSTASH_REDIS_REST_URL',
    'UPSTASH_REDIS_REST_TOKEN',
  ]) {
    if (env[name] !== undefined) process.env[name] ??= env[name]
  }

  return {
    plugins: [react(), devApi()],
    preview: {
      headers: securityHeaders,
    },
    build: {
      // İki sayfa: mağaza ve gizlilik politikası.
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('./index.html', import.meta.url)),
          gizlilik: fileURLToPath(new URL('./gizlilik.html', import.meta.url)),
        },
      },
    },
  }
})
