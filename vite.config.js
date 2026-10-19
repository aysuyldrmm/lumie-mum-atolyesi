import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// Yalnızca `npm run dev` sırasında api/ klasöründeki route'ları çalıştırır;
// yayında aynı dosyaları Vercel çalıştırır. Route'lar Web standardı
// `export function POST(request)` biçimindedir.
function devApi() {
  return {
    name: 'lumie-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use('/api', async (req, res, next) => {
        const name = req.url.split('?')[0].replace(/^\//, '')
        // `_lib` gibi yardımcı dosyalar route değildir.
        if (!/^[a-z][a-z-]*$/.test(name)) return next()

        let route
        try {
          route = await server.ssrLoadModule(`/api/${name}.js`)
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
          server.ssrFixStacktrace(error)
          console.error(error)
          res.statusCode = 500
          res.end()
        }
      })
    },
  }
}

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
  }
})
