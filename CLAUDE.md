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

## Projeyi açma ve kapatma

**Açmak için:**

1. Bir terminal açın (VS Code'da `Terminal > New Terminal` ya da Windows'ta PowerShell).
2. Proje klasörüne geçin: `cd C:\Users\YOGA\lumie`
3. İlk kez açıyorsanız (ya da `node_modules` klasörü yoksa) bağımlılıkları kurun: `npm install`
4. Geliştirme sunucusunu başlatın: `npm run dev`
5. Terminalde görünen adresi tarayıcıda açın (genellikle `http://localhost:5173/`).
6. Kodda yaptığınız değişiklikler kaydedince tarayıcıya kendiliğinden yansır; sunucuyu yeniden başlatmanız gerekmez.
7. Formların webhook'a gidebilmesi için proje klasöründe `.env.local` dosyası ve içinde `WEBHOOK_URL` bulunmalı. Dosya yoksa `.env.example`'ı `.env.local` adıyla kopyalayıp webhook.site test adresini yazın. Bu dosyayı değiştirirseniz sunucuyu kapatıp yeniden açın.

**Kapatmak için:**

1. Sunucunun çalıştığı terminale tıklayın.
2. `Ctrl + C` tuşlarına basın. Onay sorulursa `Y` yazıp Enter'a basın.
3. Tarayıcı sekmesini kapatabilirsiniz; sunucu kapandıktan sonra sayfa yenilenirse açılmaz, bu normaldir.

## Mimari ve React geçişi

- Proje Vite + React ile çalışır. Geliştirme sunucusu: `npm run dev`.
- Ürün verisi (ad, fiyat, açıklama, kategori vb.) yalnızca `src/data/products.js` içinde tutulur. Bileşenler veriyi buradan almalı, ürün bilgisi bileşenlerin içine yazılmamalı.
- Yeni bir ürün eklemek ya da fiyat değiştirmek için yalnızca bu veri dosyasını düzenlemek yetmeli.
- Kategorilerin ekranda görünen adları `src/data/categories.js` içindedir; `products.js` yalnızca kategori kimliğini (`kokulu`, `kavanoz`, `dekoratif`) tutar.
- Stok yalnızca `products.js` içindeki `stock` alanında (eldeki adet) tutulur. Ayrı bir "tükendi" alanı tutulmaz; tükenme durumu her zaman `products.js`'deki `isSoldOut(product)` ile belirlenir.
- Ürün fotoğrafları `public/images/<id>.png` dosyalarındadır ve `products.js`'deki `image` alanıyla (`/images/<id>.png`) bağlanır. Fotoğraf yoksa ya da yüklenemezse `ProductImage` alev simgesini gösterir.
- Ürün `id` değerleri webhook'a `productId` olarak gideceği için değiştirilmez.
- Kategori filtresindeki düğmelerin kısa adları ve sırası `src/data/categories.js`'deki `categoryShortLabels`'dadır. Yeni bir kategori eklenirse hem `categoryLabels`'a hem buraya eklenmeli.
- Bileşenler `src/components/` altında: `ProductList` → `ProductCard` → `ProductImage`; `ProductList` seçili kategoriyi tutar ve listenin üstünde `CategoryFilter` düğmelerini gösterir (ürünü olmayan kategorilerin düğmesi gizlenir); formlar için `ProductCard` → `FormDialog` → `OrderForm` / `StockNotificationForm`. Ürün listesinin altındaki `CatalogQRCode`, sayfanın adresini `qrcode.react` ile karekod olarak gösterir.
- Formlar webhook'a doğrudan değil, sitenin kendi API route'ları üzerinden gider: tarayıcı → `/api/order` ya da `/api/stock-notification` → webhook. Route'lar `api/` klasöründedir (Vercel Functions, `export function POST(request)`); ortak akış `api/_lib/handle-form.js`'tedir. Sunucu ürünü `productId` ile `products.js`'ten bulur, doğrulamayı yeniden yapar ve payload'ı kendisi hazırlar.
- Doğrulama ve payload hazırlama `src/data/webhook.js` içindedir; bu dosya hem tarayıcıda hem sunucuda kullanılır, bu yüzden içine `import.meta.env` ya da `process.env` yazılmaz.
- Webhook adresi yalnızca sunucudaki `WEBHOOK_URL` ortam değişkenindedir (`VITE_` öneki **olmamalı**, yoksa tarayıcı koduna gömülür). Yerelde `.env.local`'dan, yayında Vercel panelinden okunur.
- `npm run dev` sırasında `api/` route'larını `vite.config.js`'deki `devApi` eklentisi çalıştırır; ayrıca `vercel dev` gerekmez.
- API route'ları aynı IP'den dakikada en fazla 10 isteği kabul eder (`api/_lib/rate-limit.js`, `429` döner). Sayaç Upstash Redis'te tutulur (`KV_REST_API_URL` / `KV_REST_API_TOKEN`); bu bilgiler yoksa, örneğin yerelde, bellekteki sayaç kullanılır. Bellekteki sayaç Vercel'de güvenilir değildir, çünkü Vercel kodu birden çok kopyada çalıştırır. Upstash yanıt vermezse istek kabul edilir ve durum loga yazılır.
- `html-surum/index.html` eski, yalnızca HTML/CSS sürümüdür; referans olarak saklanır, düzenlenmez.

## Yayına alma (Vercel)

1. vercel.com'da GitHub ile giriş yapın, **Add New → Project** ile `aysuyldrmm/lumie-mum-atolyesi` deposunu seçin. Framework "Vite" olarak kendiliğinden seçilir.
2. **Settings → Environment Variables** bölümüne `WEBHOOK_URL` ekleyin: **Production** için gerçek webhook adresi, **Preview** için webhook.site test adresi.
3. **Storage → Upstash (Redis)** ile ücretsiz bir veritabanı oluşturup projeye bağlayın. `KV_REST_API_URL` ve `KV_REST_API_TOKEN` değişkenlerini Vercel kendisi ekler; istek sınırı bunlarla çalışır.
4. Deploy edin. Sonrasında her `main` push'u yayına otomatik çıkar. Ortam değişkenlerini değiştirirseniz değişikliğin geçmesi için yeniden deploy edin.

## Formlar ve webhook

Karttaki düğme stoka göre değişir ve ilgili formu açılır pencerede açar. Formlar webhook'a şu alanları gönderir:

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
