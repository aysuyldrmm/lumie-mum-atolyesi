import { products } from '../data/products.js'
import ProductCard from './ProductCard.jsx'

export default function ProductList() {
  return (
    <section className="urunler">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}
