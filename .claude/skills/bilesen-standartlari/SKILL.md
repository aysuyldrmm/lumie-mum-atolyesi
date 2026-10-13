---
name: bilesen-standartlari
description: Lumie sitesinde yeni bir React bileşeni yazarken veya mevcut bir bileşeni değiştirirken izlenecek kurallar (dosya adı, veri kaynağı, CSS sınıf adları, renkler, metinler). src/components altında iş yapılacağında kullan.
---

# Bileşen standartları

Kurallar mevcut bileşenlerden çıkarıldı: `ProductList` → `ProductCard` → `ProductImage`.

## Dosya ve adlandırma

- Bileşenler `src/components/` altında, bileşen başına bir dosya.
- Dosya adı PascalCase ve `.jsx`: `ProductCard.jsx`. İçindeki fonksiyonun adı dosya adıyla aynı olur ve `export default function ProductCard(...)` biçiminde dışa aktarılır.
- Bileşen ve prop adları İngilizce (`ProductCard`, `product`, `onOrder`), ekranda görünen metinler Türkçe.
- İçe aktarmalarda dosya uzantısı her zaman yazılır: `'./ProductCard.jsx'`, `'../data/products.js'`.
- Kod stili: 2 boşluk girinti, tek tırnak, satır sonunda noktalı virgül yok.

## Veri nereden alınır

- Ürün bilgileri (ad, fiyat, açıklama, kategori, stok) **yalnızca** `src/data/products.js`'den gelir. Bileşenin içine ürün adı, fiyat ya da açıklama yazılmaz.
- Kategorilerin ekranda görünen adları `src/data/categories.js` içindeki `categoryLabels`'dan alınır. Karşılığı yoksa kimliğin kendisi gösterilir: `categoryLabels[product.category] ?? product.category`.
- Bir ürünün tükenip tükenmediği her zaman `isSoldOut(product)` ile belirlenir. `product.stock === 0` gibi kontroller bileşende tekrar yazılmaz.
- Listeyi yalnızca `ProductList` veri dosyasından okur. Alt bileşenlere ürün nesnesinin tamamı tek bir `product` prop'u olarak verilir, `key` olarak `product.id` kullanılır.

## CSS

- Tüm stiller `src/index.css` içinde. Satır içi `style`, CSS modülü ve harici stil kütüphanesi kullanılmaz.
- Sınıf adları Türkçe, küçük harf, Türkçe karakter içermez ve kelimeler tire ile ayrılır: `kart`, `kart-ust`, `kart-alt`, `dugme`, `fiyat`, `tukendi-etiketi`.
- Bir öğenin farklı durumları `--` ile gösterilir: `kart--tukendi`. Durum sınıfı ana sınıfa eklenir: `className={soldOut ? 'kart kart--tukendi' : 'kart'}`.
- Bir durumda alt öğelerin görünümü değişecekse ayrı sınıflar eklenmez, üst sınıf üzerinden seçilir: `.kart--tukendi .fiyat`.

## Renkler

- Yalnızca CLAUDE.md'deki palet değişkenleri kullanılır: `--krem`, `--krem-koyu`, `--bal`, `--bal-koyu`, `--kahve`, `--kahve-acik`.
- Yarı saydam gölgelerde paletteki bir rengin RGB değeri kullanılır ve hangi değişkene karşılık geldiği yorumla belirtilir, örneğin `/* Gölge rengi: --bal-koyu (#b27624) */`.
- Mevcut CSS'teki `#fff` (`.fiyat`), `#ffe7a8` (`.alev`) ve `#e8d6b8` (alt bilgi kenarlığı) eski istisnalardır, yeni kodda kullanılmaz.

## Erişilebilirlik ve HTML

- Düğmeler her zaman `<button type="button">` olur. Form gönderen düğmeler `type="submit"` olur.
- Yalnızca süs amaçlı öğelere `aria-hidden="true"` verilir, alev simgesi gibi.
- Kart gibi kendi başına anlamlı içerikler `<article>`, listeler `<section>` ile sarılır.

## Metin

- Ziyaretçiye "siz" diye hitap edilir, dil sıcak ama abartısızdır.
- Fiyat `{product.price} TL` biçiminde gösterilir.
- Yorumlar Türkçe, kısa ve yalnızca kodun kendisinden anlaşılmayan şeyler için yazılır.

## Düzen

- Bir öğe metin uzunluğuna göre büyüyüp küçülebiliyorsa (düğme metni, ürün adı vb.) kartların hizasının bozulmadığından emin olun. Ölçüt: tükenmiş bir kart ile stokta olan bir kart yan yana aynı yükseklikte görünmeli.

## Bitirmeden önce

1. `npm run build` hatasız tamamlanmalı.
2. Değişiklik `npm run dev` ile tarayıcıda; en az bir stokta olan ve bir tükenmiş ürün kartı yan yana görünürken kontrol edilmeli.
3. Yeni bir veri dosyası ya da kural eklendiyse CLAUDE.md'deki "Mimari" bölümü güncellenmeli.
