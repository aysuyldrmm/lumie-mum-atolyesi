// Form doğrulaması ve webhook payload'ı burada hazırlanır. Dosya web sitesinde,
// telefon uygulamasında (mobile/) ve api/ altındaki sunucu kodunda kullanılır;
// bu yüzden içine tarayıcıya ya da Node'a özgü bir şey yazılmaz.
// event, productId, productName ve onay kaydının sürümü ile saati formlardan
// değil buradan gelir.
import { PRIVACY_POLICY_VERSION } from './privacy.js'

// Kaydın nereden geldiği. İstemci yalnızca bu değerlerden birini bildirebilir;
// bildirmezse web sitesi sayılır.
export const SOURCES = ['lumie-web', 'lumie-mobile']
export const DEFAULT_SOURCE = 'lumie-web'

// @ işaretinin iki yanındaki parçalar noktayla başlayıp bitemez, art arda
// nokta içeremez; alan adında en az bir nokta olmalı.
const EMAIL_PATTERN = /^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)+$/
const PHONE_PATTERN = /^\+?\d+$/

// En fazla karakter sayıları (boşluklar temizlendikten sonra). Formlardaki
// `maxLength` da bu değerleri kullanır; sunucu ayrıca kontrol eder.
// E-posta için 254, standardın izin verdiği en uzun adrestir.
export const FIELD_LIMITS = { name: 100, email: 254, phone: 20 }

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

export function buildOrderPayload(
  product,
  { name, phone, email, quantity },
  { now = new Date(), source = DEFAULT_SOURCE } = {},
) {
  return {
    event: 'order_created',
    name: cleanName(name),
    productId: product.id,
    productName: product.name,
    phone: cleanPhone(phone),
    email: cleanEmail(email),
    quantity: Number(quantity),
    ...consentRecord(now),
    source,
  }
}

export function buildStockNotificationPayload(
  product,
  { name, email },
  { now = new Date(), source = DEFAULT_SOURCE } = {},
) {
  return {
    event: 'stock_notification_requested',
    name: cleanName(name),
    productId: product.id,
    productName: product.name,
    email: cleanEmail(email),
    ...consentRecord(now),
    source,
  }
}

// İki formun ortak alanları: ad, e-posta ve açık rıza kutucuğu.
function validateCommonFields({ name, email, consent }) {
  const errors = {}
  const cleanedName = cleanName(name)
  if (!cleanedName) {
    errors.name = 'Lütfen adınızı yazın.'
  } else if (cleanedName.length > FIELD_LIMITS.name) {
    errors.name = `Adınız en fazla ${FIELD_LIMITS.name} karakter olabilir.`
  }
  if (consent !== true) {
    errors.consent = 'Devam etmek için onay kutucuğunu işaretlemeniz gerekiyor.'
  }
  const cleanedEmail = cleanEmail(email)
  // Uzunluk diğer e-posta kontrollerinden önce bakılır; çok uzun metin işlenmez.
  const turkishLetters =
    cleanedEmail.length > FIELD_LIMITS.email
      ? []
      : [...new Set(cleanedEmail)].filter((letter) => letter in TURKISH_LETTERS)
  if (cleanedEmail.length > FIELD_LIMITS.email) {
    errors.email = `E-posta adresi en fazla ${FIELD_LIMITS.email} karakter olabilir.`
  } else if (turkishLetters.length > 0) {
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
  const cleanedPhone = cleanPhone(values.phone)
  if (cleanedPhone.length > FIELD_LIMITS.phone) {
    errors.phone = `Telefon numarası en fazla ${FIELD_LIMITS.phone} karakter olabilir.`
  } else if (!PHONE_PATTERN.test(cleanedPhone)) {
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

// İstemci yalnızca sitenin API route'larına gönderir; ürün adı gibi sabit
// alanları sunucu ekler. Sunucu alan hatası dönerse `error.errors`'ta gelir;
// istek sınırı aşıldıysa `error.rateLimited` doğrudur.
// Web sitesi seçenek vermez (aynı sitedeki /api). Telefon uygulaması sitenin
// adresini (`baseUrl`) ve kaynağını (`source: 'lumie-mobile'`) verir.
async function sendToApi(path, product, values, { baseUrl = '', source } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: product.id, ...values, ...(source && { source }) }),
  })
  if (!response.ok) {
    const error = new Error(`API yanıtı: ${response.status}`)
    error.rateLimited = response.status === 429
    error.errors = (await response.json().catch(() => ({}))).errors
    throw error
  }
}

export const sendOrder = (product, values, options) =>
  sendToApi('/api/order', product, values, options)

export const sendStockNotification = (product, values, options) =>
  sendToApi('/api/stock-notification', product, values, options)
