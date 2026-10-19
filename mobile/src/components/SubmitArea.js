import { StyleSheet, Text, View } from 'react-native'
import { colors, serif } from '../theme.js'
import PrimaryButton from './PrimaryButton.js'

// Formların altı: gönderim hatası mesajı ve gönder düğmesi.
// `status`: 'idle' | 'sending' | 'error' | 'rate-limited'
export default function SubmitArea({ status, label, errorMessage, onSubmit }) {
  const sending = status === 'sending'
  return (
    <View style={styles.area}>
      {status === 'error' && <Text style={styles.message}>{errorMessage}</Text>}
      {status === 'rate-limited' && (
        <Text style={styles.message}>
          Kısa sürede çok fazla deneme yapıldı. Lütfen bir dakika sonra tekrar deneyin.
        </Text>
      )}
      <PrimaryButton
        label={sending ? 'Gönderiliyor…' : label}
        onPress={onSubmit}
        disabled={sending}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  area: {
    gap: 10,
  },
  message: {
    fontFamily: serif,
    fontSize: 13,
    color: colors.balKoyu,
  },
})
