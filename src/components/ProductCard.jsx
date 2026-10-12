import { categoryLabels } from '../data/categories.js'
import { isSoldOut } from '../data/products.js'
import ProductImage from './ProductImage.jsx'

export default function ProductCard({ product }) {
  const soldOut = isSoldOut(product)

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
        {/* Düğmeler bir sonraki adımda formları açacak. */}
        <button type="button" className="dugme">
          {soldOut ? 'Stok Gelince Haber Ver' : 'Sipariş Ver'}
        </button>
        <span className="fiyat">{product.price} TL</span>
      </div>
    </article>
  )
}
