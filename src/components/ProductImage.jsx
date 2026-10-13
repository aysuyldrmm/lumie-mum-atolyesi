import { useState } from 'react'

// Fotoğraf yoksa ya da yüklenemezse CSS ile çizilen alev simgesi gösterilir.
export default function ProductImage({ product }) {
  const [failed, setFailed] = useState(false)
  const showPhoto = product.image && !failed

  return (
    <div className="gorsel">
      {showPhoto ? (
        <img src={product.image} alt={product.name} onError={() => setFailed(true)} />
      ) : (
        <div className="alev" aria-hidden="true"></div>
      )}
    </div>
  )
}
