import { isSoldOut } from '../src/data/products.js'
import { buildOrderPayload, validateOrder } from '../src/data/webhook.js'
import { handleForm } from './_lib/handle-form.js'

// Sipariş Ver: yalnızca stokta olan ürünler.
export function POST(request) {
  return handleForm(request, {
    fields: ['name', 'phone', 'email', 'quantity'],
    acceptsProduct: (product) => !isSoldOut(product),
    validate: validateOrder,
    buildPayload: buildOrderPayload,
  })
}
