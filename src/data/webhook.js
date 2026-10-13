// Formlardan webhook'a giden veri burada hazırlanır ve gönderilir.
// event, source, productId ve productName formlardan değil buradan gelir.
const SOURCE = 'lumie-web'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_PATTERN = /^\+?\d+$/

const cleanName = (name) => name.trim()
const cleanEmail = (email) => email.trim().toLowerCase()
// Telefon metin olarak kalır; sayıya çevrilirse baştaki 0 ya da + kaybolur.
const cleanPhone = (phone) => phone.replace(/\s/g, '')

export function buildOrderPayload(product, { name, phone, email, quantity }) {
  return {
    event: 'order_created',
    name: cleanName(name),
    productId: product.id,
    productName: product.name,
    phone: cleanPhone(phone),
    email: cleanEmail(email),
    quantity: Number(quantity),
    source: SOURCE,
  }
}

export function buildStockNotificationPayload(product, { name, email }) {
  return {
    event: 'stock_notification_requested',
    name: cleanName(name),
    productId: product.id,
    productName: product.name,
    email: cleanEmail(email),
    source: SOURCE,
  }
}

function validateNameAndEmail({ name, email }) {
  const errors = {}
  if (!cleanName(name)) errors.name = 'Lütfen adınızı yazın.'
  if (!EMAIL_PATTERN.test(cleanEmail(email))) {
    errors.email = 'Lütfen geçerli bir e-posta adresi yazın.'
  }
  return errors
}

export function validateOrder(product, values) {
  const errors = validateNameAndEmail(values)
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
  return validateNameAndEmail(values)
}

export async function sendToWebhook(payload) {
  const url = import.meta.env.VITE_WEBHOOK_URL
  if (!url) throw new Error('VITE_WEBHOOK_URL tanımlı değil.')

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new Error(`Webhook yanıtı: ${response.status}`)
}
