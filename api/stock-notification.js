import { isSoldOut } from '../src/data/products.js'
import { buildStockNotificationPayload, validateStockNotification } from '../src/data/webhook.js'
import { handleForm } from './_lib/handle-form.js'

// Stok Bildirimi İste: yalnızca tükenen ürünler.
export function POST(request) {
  return handleForm(request, {
    fields: ['name', 'email'],
    acceptsProduct: isSoldOut,
    validate: (product, values) => validateStockNotification(values),
    buildPayload: buildStockNotificationPayload,
  })
}
