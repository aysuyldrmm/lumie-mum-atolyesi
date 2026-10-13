// Tüm ürün verisi burada tutulur. Ürün eklemek veya fiyat değiştirmek için
// yalnızca bu dosyayı düzenleyin; bileşenlere ürün bilgisi yazmayın.
export const products = [
  {
    id: 'lavanta-ruyasi',
    name: 'Lavanta Rüyası',
    category: 'kokulu',
    price: 350,
    stock: 12,
    image: '/images/lavanta-ruyasi.png',
    description: 'Lavanta kokulu soya mumu. Huzurlu akşamlar için.',
  },
  {
    id: 'amber-aksami',
    name: 'Amber Akşamı',
    category: 'kavanoz',
    price: 420,
    stock: 0,
    image: '/images/amber-aksami.png',
    description: 'Cam kavanozda, amber ve vanilyanın sıcak buluşması.',
  },
  {
    id: 'mini-teraryum-mum',
    name: 'Mini Teraryum Mum',
    category: 'dekoratif',
    price: 280,
    stock: 5,
    image: '/images/mini-teraryum-mum.png',
    description: 'Seramik kasede, kokusuz. Masanıza küçük bir doğa köşesi.',
  },
]

// Tükenme durumu ayrıca saklanmaz, her zaman stoktan türetilir.
export const isSoldOut = (product) => product.stock <= 0
