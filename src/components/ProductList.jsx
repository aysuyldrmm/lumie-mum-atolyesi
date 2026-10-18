import { useState } from 'react'
import { products } from '../data/products.js'
import CategoryFilter from './CategoryFilter.jsx'
import ProductCard from './ProductCard.jsx'

// Filtrede yalnızca en az bir ürünü olan kategoriler gösterilir.
const availableCategories = new Set(products.map((product) => product.category))

export default function ProductList() {
  const [category, setCategory] = useState(null)
  const visibleProducts = category
    ? products.filter((product) => product.category === category)
    : products

  return (
    <>
      <CategoryFilter
        categories={availableCategories}
        selected={category}
        onSelect={setCategory}
      />
      {visibleProducts.length > 0 ? (
        <section className="urunler">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      ) : (
        <p className="bos-liste">Bu kategoride şimdilik ürün bulunmuyor.</p>
      )}
    </>
  )
}
