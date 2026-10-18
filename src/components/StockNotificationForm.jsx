import { useState } from 'react'
import { sendStockNotification, validateStockNotification } from '../data/webhook.js'

export default function StockNotificationForm({ product, onDone }) {
  const [values, setValues] = useState({ name: '', email: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newErrors = validateStockNotification(values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setStatus('sending')
    try {
      await sendStockNotification(product, values)
      setStatus('success')
    } catch (error) {
      if (error.errors) {
        setErrors(error.errors)
        setStatus('idle')
      } else {
        setStatus('error')
      }
    }
  }

  if (status === 'success') {
    return (
      <div className="onay-mesaji">
        <p>Ürün yeniden stoka girdiğinde size e-posta göndereceğiz.</p>
        <button type="button" className="dugme dugme--dolu" onClick={onDone}>
          Kapat
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <p className="form-urun">
        {product.name} şu an tükendi. Bilgilerinizi bırakın, stoka girince size haber verelim.
      </p>

      <label className="form-alan">
        Adınız
        <input name="name" value={values.name} onChange={handleChange} autoComplete="name" />
        {errors.name && <span className="alan-hatasi">{errors.name}</span>}
      </label>

      <label className="form-alan">
        E-posta
        <input
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          autoComplete="email"
        />
        {errors.email && <span className="alan-hatasi">{errors.email}</span>}
      </label>

      {status === 'error' && (
        <p className="form-hatasi">
          Talebiniz gönderilemedi. Lütfen biraz sonra tekrar deneyin.
        </p>
      )}

      <button type="submit" className="dugme dugme--dolu" disabled={status === 'sending'}>
        {status === 'sending' ? 'Gönderiliyor…' : 'Haber Ver'}
      </button>
    </form>
  )
}
