import { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'
import { API_URL } from '../config.js'
import { colors } from '../theme.js'

// Fotoğraflar web sitesinden yüklenir. Fotoğraf yoksa ya da yüklenemezse
// (ör. internet yoksa) alev simgesi gösterilir.
export default function ProductImage({ product, soldOut }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = product.image && !failed

  return (
    <View style={styles.box}>
      {showPhoto ? (
        <Image
          source={{ uri: `${API_URL}${product.image}` }}
          style={[styles.photo, soldOut && styles.photoSoldOut]}
          resizeMode="cover"
          accessibilityLabel={product.name}
          onError={() => setFailed(true)}
        />
      ) : (
        <View style={[styles.flame, soldOut && styles.flameSoldOut]} accessibilityElementsHidden />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    aspectRatio: 4 / 3,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.kremKoyu,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoSoldOut: {
    opacity: 0.55,
  },
  flame: {
    width: 14,
    height: 22,
    backgroundColor: colors.bal,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  flameSoldOut: {
    backgroundColor: colors.krem,
  },
})
