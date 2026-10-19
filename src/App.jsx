import CatalogQRCode from './components/CatalogQRCode.jsx'
import ProductList from './components/ProductList.jsx'
import { PRIVACY_POLICY_PATH } from './data/privacy.js'

export default function App() {
  return (
    <>
      <header>
        <h1>Lumie <span>Mum Atölyesi</span></h1>
        <p className="slogan">El yapımı, kalbe dokunan sıcak ışıklar.</p>
      </header>

      <main>
        <h2>Ürünlerimiz</h2>
        <ProductList />
        <CatalogQRCode />
      </main>

      <footer>
        &copy; 2026 Lumie Mum Atölyesi · El yapımı, sevgiyle. ·{' '}
        <a href={PRIVACY_POLICY_PATH}>Gizlilik Politikası</a>
      </footer>
    </>
  )
}
