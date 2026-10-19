import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  FIELD_LIMITS,
  sendStockNotification,
  validateStockNotification,
} from '../../../src/data/webhook.js'
import { API_URL, SOURCE } from '../config.js'
import { colors, serif } from '../theme.js'
import ConsentField from './ConsentField.js'
import FormField from './FormField.js'
import SubmitArea from './SubmitArea.js'
import SuccessMessage from './SuccessMessage.js'

export default function StockNotificationForm({ product, onDone }) {
  const [values, setValues] = useState({ name: '', email: '', consent: false })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const setValue = (name) => (value) => setValues({ ...values, [name]: value })

  const handleSubmit = async () => {
    const newErrors = validateStockNotification(values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setStatus('sending')
    try {
      await sendStockNotification(product, values, { baseUrl: API_URL, source: SOURCE })
      setStatus('success')
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors)
        setStatus('idle')
      } else {
        setStatus(error.rateLimited ? 'rate-limited' : 'error')
      }
    }
  }

  if (status === 'success') {
    return (
      <SuccessMessage
        message="Ürün yeniden stoka girdiğinde size e-posta göndereceğiz."
        onDone={onDone}
      />
    )
  }

  return (
    <View>
      <Text style={styles.product}>
        {product.name} şu an tükendi. Bilgilerinizi bırakın, stoka girince size haber verelim.
      </Text>
      <FormField
        label="Adınız"
        value={values.name}
        onChangeText={setValue('name')}
        error={errors.name}
        autoComplete="name"
        textContentType="name"
        maxLength={FIELD_LIMITS.name}
      />
      <FormField
        label="E-posta"
        value={values.email}
        onChangeText={setValue('email')}
        error={errors.email}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        maxLength={FIELD_LIMITS.email}
      />
      <ConsentField checked={values.consent} onChange={setValue('consent')} error={errors.consent} />
      <SubmitArea
        status={status}
        label="Haber Ver"
        errorMessage="Talebiniz gönderilemedi. Lütfen biraz sonra tekrar deneyin."
        onSubmit={handleSubmit}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  product: {
    marginBottom: 16,
    fontFamily: serif,
    fontSize: 15,
    lineHeight: 21,
    color: colors.kahveAcik,
  },
})
