import { useState } from 'react'
import { sendOrder, validateOrder } from '../data/webhook.js'

export default function OrderForm({ product, onDone }) {
  const [values, setValues] = useState({ name: '', phone: '', email: '', quantity: '1' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const newErrors = validateOrder(product, values)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setStatus('sending')
    try {
      await sendOrder(product, values)
      setStatus('success')
    } catch (error) {
      // Sunucu bir alanı reddettiyse (örneğin stok azaldıysa) hata o alanın altında görünür.
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
        <p>Siparişiniz bize ulaştı, en kısa sürede sizinle iletişime geçeceğiz.</p>
        <button type="button" className="dugme dugme--dolu" onClick={onDone}>
          Kapat
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <p className="form-urun">
        {product.name} · {product.price} TL
      </p>

      <label className="form-alan">
        Adınız
        <input name="name" value={values.name} onChange={handleChange} autoComplete="name" />
        {errors.name && <span className="alan-hatasi">{errors.name}</span>}
      </label>

      <label className="form-alan">
        Telefon
        <input
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          autoComplete="tel"
        />
        {errors.phone && <span className="alan-hatasi">{errors.phone}</span>}
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

      <label className="form-alan">
        Adet
        <input
          name="quantity"
          type="number"
          min="1"
          max={product.stock}
          value={values.quantity}
          onChange={handleChange}
        />
        {errors.quantity && <span className="alan-hatasi">{errors.quantity}</span>}
      </label>

      {status === 'error' && (
        <p className="form-hatasi">
          Siparişiniz gönderilemedi. Lütfen biraz sonra tekrar deneyin.
        </p>
      )}

      <button type="submit" className="dugme dugme--dolu" disabled={status === 'sending'}>
        {status === 'sending' ? 'Gönderiliyor…' : 'Siparişi Gönder'}
      </button>
    </form>
  )
}
