import { QRCodeSVG } from 'qrcode.react'

export default function CatalogQRCode() {
  return (
    <section className="katalog-qr">
      <h3>Kataloğu telefonunuzda açın</h3>
      {/* currentColor ile karekod rengi CSS'teki palet değişkeninden gelir. */}
      <QRCodeSVG
        value={window.location.href}
        size={128}
        fgColor="currentColor"
        bgColor="transparent"
        title="Lumie kataloğunun adresi"
        className="karekod"
      />
    </section>
  )
}
