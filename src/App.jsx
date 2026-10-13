import CatalogQRCode from './components/CatalogQRCode.jsx'
import ProductList from './components/ProductList.jsx'

export default function App() {
  return (
    <>
      <header>
        <h1>Lumie <span>Mum Atölyesi</span></h1>
        <p className="slogan">Elde dökülen, kalbe dokunan sıcak ışıklar.</p>
      </header>

      <main>
        <h2>Ürünlerimiz</h2>
        <ProductList />
        <CatalogQRCode />
      </main>

      <footer>
        &copy; 2026 Lumie Mum Atölyesi · El yapımı, sevgiyle.
      </footer>
    </>
  )
}
