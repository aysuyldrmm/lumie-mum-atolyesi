import { StyleSheet, Text, TextInput, View } from 'react-native'
import { colors, serif } from '../theme.js'

// Etiket, metin kutusu ve altında alan hatası. Diğer ayarlar (klavye türü,
// otomatik doldurma, en fazla uzunluk) TextInput'a olduğu gibi geçer.
export default function FormField({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.kahveAcik}
        accessibilityLabel={label}
        {...inputProps}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  field: {
    gap: 5,
    marginBottom: 14,
  },
  label: {
    fontFamily: serif,
    fontSize: 14,
    color: colors.kahve,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.kremKoyu,
    borderRadius: 8,
    backgroundColor: colors.krem,
    fontFamily: serif,
    fontSize: 16,
    color: colors.kahve,
  },
  inputError: {
    borderColor: colors.bal,
  },
  error: {
    fontFamily: serif,
    fontSize: 13,
    color: colors.balKoyu,
  },
})
