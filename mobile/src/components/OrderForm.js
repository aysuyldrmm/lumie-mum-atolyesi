import { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { FIELD_LIMITS, sendOrder, validateOrder } from '../../../src/data/webhook.js'
import { API_URL, SOURCE } from '../config.js'
import { colors, serif } from '../theme.js'
import ConsentField from './ConsentField.js'
import FormField from './FormField.js'
import SubmitArea from './SubmitArea.js'
import SuccessMessage from './SuccessMessage.js'

export default function OrderForm({ product, onDone }) {
  const [values, setValues] = useState({
    name: '',
    phone: '',
    email: '',
    quantity: '1',
    consent: false,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const setValue = (name) => (value) => setValues({ ...values, [name]: value })

  const handleSubmit = async () => {
    const newErrors = validateOrder(product, values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setStatus('sending')
    try {
      await sendOrder(product, values, { baseUrl: API_URL, source: SOURCE })
      setStatus('success')
    } catch (error) {
      // Sunucu bir alanı reddettiyse (örneğin stok azaldıysa) hata o alanın altında görünür.
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
        message="Siparişiniz bize ulaştı, en kısa sürede sizinle iletişime geçeceğiz."
        onDone={onDone}
      />
    )
  }

  return (
    <View>
      <Text style={styles.product}>
        {product.name} · {product.price} TL
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
        label="Telefon"
        value={values.phone}
        onChangeText={setValue('phone')}
        error={errors.phone}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        maxLength={FIELD_LIMITS.phone}
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
      <FormField
        label="Adet"
        value={values.quantity}
        onChangeText={setValue('quantity')}
        error={errors.quantity}
        keyboardType="number-pad"
        maxLength={3}
      />
      <ConsentField checked={values.consent} onChange={setValue('consent')} error={errors.consent} />
      <SubmitArea
        status={status}
        label="Siparişi Gönder"
        errorMessage="Siparişiniz gönderilemedi. Lütfen biraz sonra tekrar deneyin."
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
    color: colors.kahveAcik,
  },
})
