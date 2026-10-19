// İki API route'unun ortak akışı: isteği okur, ürünü bulur, sunucuda yeniden
// doğrular, payload'ı hazırlar ve webhook'a iletir. Webhook adresi yalnızca
// sunucudaki WEBHOOK_URL ortam değişkeninden okunur.
import { products } from '../../src/data/products.js'
import { DEFAULT_SOURCE, SOURCES } from '../../src/data/webhook.js'
import { checkRateLimit } from './rate-limit.js'

const WEBHOOK_TIMEOUT_MS = 10000

// vercel.json'daki güvenlik başlıkları sayfalara ve dosyalara eklenir ama Vercel
// fonksiyonların yanıtlarına eklemez; API yanıtlarına burada eklenir. Yanıt
// yalnızca JSON olduğu için CSP her şeyi kapatır.
const API_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
  'Cache-Control': 'no-store',
}

export async function handleForm(request, options) {
  const response = await processForm(request, options)
  for (const [key, value] of Object.entries(API_SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }
  return response
}

async function processForm(request, { fields, acceptsProduct, validate, buildPayload }) {
  const retryAfter = await checkRateLimit(request)
  if (retryAfter !== null) {
    return Response.json(
      { error: 'Çok fazla istek.', retryAfter },
      { status: 429, headers: { 'Retry-After': String(retryAfter) } },
    )
  }

  let body
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 })
  }

  // Kaynak yalnızca izin verilen değerlerden biri olabilir; gelmezse web sitesidir.
  const source = body.source ?? DEFAULT_SOURCE
  if (!SOURCES.includes(source)) {
    return Response.json({ error: 'Geçersiz istek.' }, { status: 400 })
  }

  const product = products.find((item) => item.id === body.productId)
  if (!product || !acceptsProduct(product)) {
    return Response.json({ error: 'Ürün bulunamadı ya da bu işlem için uygun değil.' }, { status: 400 })
  }

  // Yalnızca formun alanları alınır; tarayıcıdan gelen productName, event,
  // consentVersion, consentedAt vb. yok sayılır. Onay yalnızca gerçek `true` ise geçerlidir.
  const values = Object.fromEntries(fields.map((field) => [field, String(body[field] ?? '')]))
  values.consent = body.consent === true
  const errors = validate(product, values)
  if (Object.keys(errors).length > 0) {
    return Response.json({ errors }, { status: 400 })
  }

  const url = process.env.WEBHOOK_URL
  if (!url) {
    console.error('WEBHOOK_URL tanımlı değil.')
    return Response.json({ error: 'Şu an gönderilemedi.' }, { status: 500 })
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload(product, values, { source })),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    })
    if (!response.ok) throw new Error(`Webhook yanıtı: ${response.status}`)
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'Şu an gönderilemedi.' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
