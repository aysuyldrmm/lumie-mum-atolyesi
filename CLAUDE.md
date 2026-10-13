# CLAUDE.md

## Proje

Lumie Mum Atölyesi web sitesi.

## Sektör

El yapımı mum ve mum aksesuarları.

## Hedef kitle

25-45 yaş arası, ev dekorasyonuna ve hediyeliğe ilgi duyan kişiler.

## Ürün kategorileri

- Kokulu mumlar
- Kavanoz mumlar
- Dekoratif / seramik mumlar

## Dil

Site içeriği Türkçe.

Claude kullanıcıyla Türkçe iletişim kurar.

## Tasarım tonu

Sıcak ve sade, krem ve bal rengi tonlarında.

## Mimari ve React geçişi

- Proje Vite + React ile çalışır. Geliştirme sunucusu: `npm run dev`.
- Ürün verisi (ad, fiyat, açıklama, kategori vb.) yalnızca `src/data/products.js` içinde tutulur. Bileşenler veriyi buradan almalı, ürün bilgisi bileşenlerin içine yazılmamalı.
- Yeni bir ürün eklemek ya da fiyat değiştirmek için yalnızca bu veri dosyasını düzenlemek yetmeli.
- Kategorilerin ekranda görünen adları `src/data/categories.js` içindedir; `products.js` yalnızca kategori kimliğini (`kokulu`, `kavanoz`, `dekoratif`) tutar.
- Stok yalnızca `products.js` içindeki `stock` alanında (eldeki adet) tutulur. Ayrı bir "tükendi" alanı tutulmaz; tükenme durumu her zaman `products.js`'deki `isSoldOut(product)` ile belirlenir.
- Ürün `id` değerleri webhook'a `productId` olarak gideceği için değiştirilmez.
- Bileşenler `src/components/` altında: `ProductList` → `ProductCard` → `ProductImage`.
- `html-surum/index.html` eski, yalnızca HTML/CSS sürümüdür; referans olarak saklanır, düzenlenmez.

## Formlar ve webhook (planlanan)

Karttaki düğme stoka göre değişir. Düğmelere bağlanacak formlar webhook'a şu alanları gönderecek:

- **Sipariş Ver** (stokta olan ürünler): event, name, productId, productName, phone, email, quantity, source
- **Stok Bildirimi İste** (tükenen ürünler): event, name, productId, productName, email, source

`productId` ve `productName` ürün verisinden (`id`, `name`) alınır; formlar bunları kullanıcıdan istemez.

## Renk paleti

`src/index.css` içindeki CSS değişkenleri. Yeni sayfalar ve bileşenler bu renkleri kullanmalı.

| Değişken        | Kod       | Kullanım                          |
|-----------------|-----------|-----------------------------------|
| `--krem`        | `#fbf5ea` | Sayfa arka planı                  |
| `--krem-koyu`   | `#f3e6cf` | Başlık ve alt bilgi arka planı    |
| `--bal`         | `#d99a3d` | Vurgu rengi, fiyat etiketleri     |
| `--bal-koyu`    | `#b27624` | Koyu vurgu, başlıktaki vurgu      |
| `--kahve`       | `#4a3424` | Ana metin rengi                   |
| `--kahve-acik`  | `#7a5f4a` | İkincil metin, açıklamalar        |

## Yazım ve üslup kuralları

- Ziyaretçiye "siz" diye hitap edin.
- Dil sıcak ve samimi olsun ama abartıya kaçmasın.
- Fiyatlar `350 TL` biçiminde yazılır: rakam, boşluk, "TL".
- Ürün açıklamaları 1-2 cümleyi geçmemeli.
