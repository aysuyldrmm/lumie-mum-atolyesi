import { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { categoryLabels } from '../../../src/data/categories.js'
import { isSoldOut } from '../../../src/data/products.js'
import { colors, serif } from '../theme.js'
import FormModal from './FormModal.js'
import OrderForm from './OrderForm.js'
import ProductImage from './ProductImage.js'
import StockNotificationForm from './StockNotificationForm.js'

export default function ProductCard({ product }) {
  const soldOut = isSoldOut(product)
  const [formOpen, setFormOpen] = useState(false)
  const closeForm = () => setFormOpen(false)

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <Text style={styles.category}>
          {(categoryLabels[product.category] ?? product.category).toLocaleUpperCase('tr-TR')}
        </Text>
        {soldOut && <Text style={styles.soldOutBadge}>TÜKENDİ</Text>}
      </View>
      <ProductImage product={product} soldOut={soldOut} />
      <Text style={[styles.name, soldOut && styles.faded]}>{product.name}</Text>
      <Text style={[styles.description, soldOut && styles.faded]}>{product.description}</Text>
      <View style={styles.bottom}>
        <Pressable
          onPress={() => setFormOpen(true)}
          accessibilityRole="button"
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
          {({ pressed }) => (
            <Text style={[styles.buttonText, pressed && styles.buttonTextPressed]}>
              {soldOut ? 'Stok Gelince Haber Ver' : 'Sipariş Ver'}
            </Text>
          )}
        </Pressable>
        <Text style={[styles.price, soldOut && styles.priceSoldOut]}>{product.price} TL</Text>
      </View>

      {formOpen && (
        <FormModal title={soldOut ? 'Stok Bildirimi İste' : 'Sipariş Ver'} onClose={closeForm}>
          {soldOut ? (
            <StockNotificationForm product={product} onDone={closeForm} />
          ) : (
            <OrderForm product={product} onDone={closeForm} />
          )}
        </FormModal>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: colors.krem,
    borderWidth: 1,
    borderColor: colors.kremKoyu,
    borderRadius: 14,
    // Gölge rengi: balKoyu (#b27624)
    shadowColor: colors.balKoyu,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  category: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.kremKoyu,
    color: colors.balKoyu,
    fontFamily: serif,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  soldOutBadge: {
    paddingVertical: 3,
    paddingHorizontal: 10,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.kahve,
    color: colors.krem,
    fontFamily: serif,
    fontSize: 11,
    letterSpacing: 0.8,
  },
  name: {
    marginBottom: 6,
    fontFamily: serif,
    fontSize: 20,
    color: colors.kahve,
  },
  description: {
    marginBottom: 18,
    fontFamily: serif,
    fontSize: 15,
    lineHeight: 22,
    color: colors.kahveAcik,
  },
  faded: {
    opacity: 0.7,
  },
  bottom: {
    alignItems: 'flex-end',
    gap: 12,
  },
  button: {
    alignSelf: 'stretch',
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.balKoyu,
    borderRadius: 999,
  },
  buttonPressed: {
    backgroundColor: colors.balKoyu,
  },
  buttonText: {
    fontFamily: serif,
    fontSize: 15,
    color: colors.balKoyu,
  },
  buttonTextPressed: {
    color: colors.krem,
  },
  price: {
    paddingVertical: 5,
    paddingHorizontal: 16,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.bal,
    color: colors.krem,
    fontFamily: serif,
    fontSize: 17,
  },
  priceSoldOut: {
    backgroundColor: colors.kahveAcik,
  },
})
