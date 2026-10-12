import { categoryLabels } from '../data/categories.js'
import ProductImage from './ProductImage.jsx'

export default function ProductCard({ product }) {
  return (
    <article className="kart">
      <span className="kategori">
        {categoryLabels[product.category] ?? product.category}
      </span>
      <ProductImage />
      <h3>{product.name}</h3>
      <p>{product.description}</p>
      <span className="fiyat">{product.price} TL</span>
    </article>
  )
}
