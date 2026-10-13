import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

export default function FormDialog({ title, onClose, children }) {
  const dialogRef = useRef(null)
  const titleId = useId()

  useEffect(() => {
    // StrictMode efekti iki kez çalıştırır; açık pencere yeniden açılmaz.
    if (!dialogRef.current.open) dialogRef.current.showModal()
  }, [])

  // Arka plana tıklanınca kapanır: tıklama doğrudan dialog öğesine gelir.
  const handleClick = (event) => {
    if (event.target === dialogRef.current) dialogRef.current.close()
  }

  // Kartın dışına, body'ye çizilir; yoksa .kart stilleri ve hover efekti
  // pencerenin içine de uygulanır.
  return createPortal(
    <dialog
      ref={dialogRef}
      className="pencere"
      onClose={onClose}
      onClick={handleClick}
      aria-labelledby={titleId}
    >
      <div className="pencere-ic">
        <div className="pencere-ust">
          <h3 id={titleId}>{title}</h3>
          <button
            type="button"
            className="kapat-dugmesi"
            aria-label="Kapat"
            onClick={() => dialogRef.current.close()}
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </dialog>,
    document.body,
  )
}
