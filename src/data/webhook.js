// Form doğrulaması ve webhook payload'ı burada hazırlanır. Dosya hem tarayıcıda
// (anında hata göstermek için) hem api/ altındaki sunucu kodunda kullanılır.
// event, source, productId, productName ve onay kaydının sürümü ile saati
// formlardan değil buradan gelir.
import { PRIVACY_POLICY_VERSION } from './privacy.js'

const SOURCE = 'lumie-web'

// @ işaretinin iki yanındaki parçalar noktayla başlayıp bitemez, art arda
// nokta içeremez; alan adında en az bir nokta olmalı.
const EMAIL_PATTERN = /^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)+$/
const PHONE_PATTERN = /^\+?\d+$/

// E-posta adreslerinde Türkçe harf yerine yazılması gereken harfler.
const TURKISH_LETTERS = { ş: 's', ğ: 'g', ü: 'u', ö: 'o', ç: 'c', ı: 'i' }

const cleanName = (name) => name.trim()
// toLowerCase() büyük İ'yi "i + görünmez nokta" yapar; önce düz i'ye çevrilir.
const cleanEmail = (email) => email.trim().replace(/İ/g, 'i').toLowerCase()
// Telefon metin olarak kalır; sayıya çevrilirse baştaki 0 ya da + kaybolur.
const cleanPhone = (phone) => phone.replace(/\s/g, '')

// KVKK açık rızasının kaydı: hangi politika sürümüne, ne zaman onay verildi.
// `now` sunucu saatidir; tarayıcıdan gelen saat kullanılmaz.
const consentRecord = (now) => ({
  consent: true,
  consentVersion: PRIVACY_POLICY_VERSION,
  consentedAt: now.toISOString(),
})

export function buildOrderPayload(product, { name, phone, email, quantity }, now = new Date()) {
  return {
    event: 'order_created',
    name: cleanName(name),
    productId: product.id,
    productName: product.name,
    phone: cleanPhone(phone),
    email: cleanEmail(email),
    quantity: Number(quantity),
    ...consentRecord(now),
    source: SOURCE,
  }
}

export function buildStockNotificationPayload(product, { name, email }, now = new Date()) {
  return {
    event: 'stock_notification_requested',
    name: cleanName(name),
    productId: product.id,
    productName: product.name,
    email: cleanEmail(email),
    ...consentRecord(now),
    source: SOURCE,
  }
}

// İki formun ortak alanları: ad, e-posta ve açık rıza kutucuğu.
function validateCommonFields({ name, email, consent }) {
  const errors = {}
  if (!cleanName(name)) errors.name = 'Lütfen adınızı yazın.'
  if (consent !== true) {
    errors.consent = 'Devam etmek için onay kutucuğunu işaretlemeniz gerekiyor.'
  }
  const cleanedEmail = cleanEmail(email)
  const turkishLetters = [...new Set(cleanedEmail)].filter((letter) => letter in TURKISH_LETTERS)
  if (turkishLetters.length > 0) {
    const fixes = turkishLetters
      .map((letter) => `"${letter}" yerine "${TURKISH_LETTERS[letter]}"`)
      .join(', ')
    errors.email = `E-posta adresinde Türkçe harf kullanılamaz, lütfen ${fixes} yazın.`
  } else if (!EMAIL_PATTERN.test(cleanedEmail)) {
    errors.email = 'Lütfen geçerli bir e-posta adresi yazın.'
  }
  return errors
}

export function validateOrder(product, values) {
  const errors = validateCommonFields(values)
  if (!PHONE_PATTERN.test(cleanPhone(values.phone))) {
    errors.phone = 'Lütfen telefon numaranızı yalnızca rakamlarla yazın.'
  }
  const quantity = Number(values.quantity)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > product.stock) {
    errors.quantity = `Adet 1 ile ${product.stock} arasında olmalı.`
  }
  return errors
}

export function validateStockNotification(values) {
  return validateCommonFields(values)
}

// Tarayıcı yalnızca kendi API route'umuza gönderir; ürün adı gibi sabit
// alanları sunucu ekler. Sunucu alan hatası dönerse `error.errors`'ta gelir;
// istek sınırı aşıldıysa `error.rateLimited` doğrudur.
async function sendToApi(path, product, values) {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: product.id, ...values }),
  })
  if (!response.ok) {
    const error = new Error(`API yanıtı: ${response.status}`)
    error.rateLimited = response.status === 429
    error.errors = (await response.json().catch(() => ({}))).errors
    throw error
  }
}

export const sendOrder = (product, values) => sendToApi('/api/order', product, values)

export const sendStockNotification = (product, values) =>
  sendToApi('/api/stock-notification', product, values)
