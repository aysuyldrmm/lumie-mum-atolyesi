import { Pressable, StyleSheet, Text, View } from 'react-native'
import { categoryShortLabels } from '../../../src/data/categories.js'
import { colors, serif } from '../theme.js'

// `categories`: gösterilecek kategori kimlikleri (Set). `selected` null ise
// "Tümü" seçilidir. Düğmelerin adları ve sırası web sitesiyle aynı kaynaktan gelir.
export default function CategoryFilter({ categories, selected, onSelect }) {
  const options = [
    { id: null, label: 'Tümü' },
    ...Object.entries(categoryShortLabels)
      .filter(([id]) => categories.has(id))
      .map(([id, label]) => ({ id, label })),
  ]

  return (
    <View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel="Kategoriye göre filtrele">
      {options.map((option) => {
        const isSelected = option.id === selected
        return (
          <Pressable
            key={option.id ?? 'tumu'}
            onPress={() => onSelect(option.id)}
            accessibilityRole="radio"
            aria-checked={isSelected}
            style={[styles.button, isSelected && styles.buttonSelected]}
          >
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{option.label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.kremKoyu,
    borderRadius: 999,
  },
  buttonSelected: {
    backgroundColor: colors.balKoyu,
    borderColor: colors.balKoyu,
  },
  label: {
    fontFamily: serif,
    fontSize: 15,
    color: colors.kahveAcik,
  },
  labelSelected: {
    color: colors.krem,
  },
})
