import { useState } from 'react'
import { categoryLabels } from '../data/categories.js'
import { isSoldOut } from '../data/products.js'
import FormDialog from './FormDialog.jsx'
import OrderForm from './OrderForm.jsx'
import ProductImage from './ProductImage.jsx'
import StockNotificationForm from './StockNotificationForm.jsx'

export default function ProductCard({ product }) {
  const soldOut = isSoldOut(product)
  const [formOpen, setFormOpen] = useState(false)
  const closeForm = () => setFormOpen(false)

  return (
    <article className={soldOut ? 'kart kart--tukendi' : 'kart'}>
      <div className="kart-ust">
        <span className="kategori">
          {categoryLabels[product.category] ?? product.category}
        </span>
        {soldOut && <span className="tukendi-etiketi">Tükendi</span>}
      </div>
      <ProductImage />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <div className="kart-alt">
        <button type="button" className="dugme" onClick={() => setFormOpen(true)}>
          {soldOut ? 'Stok Gelince Haber Ver' : 'Sipariş Ver'}
        </button>
        <span className="fiyat">{product.price} TL</span>
      </div>

      {formOpen && (
        <FormDialog
          title={soldOut ? 'Stok Bildirimi İste' : 'Sipariş Ver'}
          onClose={closeForm}
        >
          {soldOut ? (
            <StockNotificationForm product={product} onDone={closeForm} />
          ) : (
            <OrderForm product={product} onDone={closeForm} />
          )}
        </FormDialog>
      )}
    </article>
  )
}
