import { useState } from 'react'
import { FlatList, StyleSheet, Text } from 'react-native'
import { products } from '../../../src/data/products.js'
import { colors, serif } from '../theme.js'
import CategoryFilter from './CategoryFilter.js'
import ProductCard from './ProductCard.js'

// Filtrede yalnızca en az bir ürünü olan kategoriler gösterilir (web sitesindeki gibi).
const availableCategories = new Set(products.map((product) => product.category))

// `header` ve `footer` listenin üstünde ve altında kayan içeriklerdir.
export default function ProductList({ header, footer }) {
  const [category, setCategory] = useState(null)
  const visibleProducts = category
    ? products.filter((product) => product.category === category)
    : products

  return (
    <FlatList
      data={visibleProducts}
      keyExtractor={(product) => product.id}
      renderItem={({ item }) => <ProductCard product={item} />}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <>
          {header}
          <Text style={styles.heading}>Ürünlerimiz</Text>
          <CategoryFilter
            categories={availableCategories}
            selected={category}
            onSelect={setCategory}
          />
        </>
      }
      ListEmptyComponent={<Text style={styles.empty}>Bu kategoride şimdilik ürün bulunmuyor.</Text>}
      ListFooterComponent={footer}
    />
  )
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 0,
  },
  heading: {
    marginTop: 28,
    marginBottom: 18,
    textAlign: 'center',
    fontFamily: serif,
    fontSize: 24,
    color: colors.kahve,
  },
  empty: {
    paddingVertical: 32,
    textAlign: 'center',
    fontFamily: serif,
    fontStyle: 'italic',
    color: colors.kahveAcik,
  },
})
