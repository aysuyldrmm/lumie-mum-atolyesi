// Aynı IP'den gelen form isteklerini sınırlar. İki API route'u aynı sayacı paylaşır.
// Vercel'de sayaç Upstash Redis'te tutulur: Vercel kodu birden çok kopyada
// çalıştırdığı için bellekteki bir sayaç kopyalar arasında paylaşılmaz.
// Upstash bilgileri yoksa (örneğin yerelde) bellekteki sayaç kullanılır.
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const LIMIT = 10
const WINDOW_MS = 60 * 1000

// Vercel Upstash entegrasyonu KV_REST_API_*, Upstash'in kendisi UPSTASH_REDIS_REST_* adını verir.
const hasRedis = Boolean(
  (process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL) &&
    (process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN),
)

const redisLimiter = hasRedis
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(LIMIT, `${WINDOW_MS / 1000} s`),
      prefix: 'lumie:form',
      // Redis geç yanıt verirse istek kabul edilir; bir arıza siparişleri durdurmasın.
      timeout: 1000,
    })
  : null

const memoryHits = new Map()

function limitInMemory(ip) {
  const now = Date.now()
  const hits = (memoryHits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS)
  if (hits.length >= LIMIT) {
    memoryHits.set(ip, hits)
    return { success: false, reset: hits[0] + WINDOW_MS }
  }
  hits.push(now)
  memoryHits.set(ip, hits)
  return { success: true, reset: now + WINDOW_MS }
}

// Vercel bu başlıkları kendisi doldurur; ziyaretçinin gönderdiği değerin üzerine yazar.
function clientIp(request) {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    'bilinmiyor'
  )
}

// Sınır aşıldıysa kaç saniye sonra tekrar denenebileceğini, aşılmadıysa null döner.
export async function checkRateLimit(request) {
  const ip = clientIp(request)
  let result
  if (redisLimiter) {
    try {
      result = await redisLimiter.limit(ip)
      if (result.reason === 'timeout') {
        console.error('Rate limit: Upstash zamanında yanıt vermedi, istek kabul edildi.')
      }
    } catch (error) {
      console.error('Rate limit kontrol edilemedi, istek kabul edildi:', error)
      return null
    }
  } else {
    result = limitInMemory(ip)
  }
  if (result.success) return null
  return Math.max(1, Math.ceil((result.reset - Date.now()) / 1000))
}
