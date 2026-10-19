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

## Telefon uygulamasını açma (Expo Go)

Telefon uygulaması `mobile/` klasöründedir ve Expo SDK 57 kullanır. Telefonda mağazadaki **Expo Go** uygulaması gerekir. Expo Go her seferinde **tek bir SDK** sürümünü destekler; desteklediği sürüm Expo Go'nun ayarlarında "Supported SDK" olarak yazar.

**SDK sürümü neden 57:** npm'deki en güncel sürüm 58 olsa da iPhone'daki Expo Go (19 Ekim 2026) yalnızca SDK 57'yi destekliyordu ve "Project is incompatible with this version of Expo Go" hatası veriyordu. Expo Go mağazada 58'e güncellenince proje de yükseltilebilir: `npx expo install expo@^58.0.0` ve ardından `npx expo install --fix`. Yükseltmeden önce Expo Go'daki "Supported SDK" değerine bakın. Not: SDK 58'de `--tunnel` Expo hesabıyla giriş ister, ngrok için `--tunnel ngrok` yazılır.

**İlk kez:**

1. Terminalde uygulama klasörüne geçin: `cd C:\Users\YOGA\lumie\mobile`
2. Bağımlılıkları kurun: `npm install`

**Telefon ve bilgisayar aynı Wi-Fi'daysa:**

1. `npm run start`
2. Terminalde çıkan karekodu telefonun kamerasıyla (iPhone) ya da Expo Go'nun içinden (Android) okutun. Android'in kendi kamerası ya da Google Lens `exp://` adreslerini tanımaz ("unsupported QR code" der); Expo Go'daki "Enter URL manually" ile terminaldeki `exp://…` adresi de girilebilir.
3. Windows bu Wi-Fi'ı "Genel" (Public) ağ sayıyorsa güvenlik duvarı telefonun bağlantısını engelleyebilir; "Node.js'in ağda iletişim kurmasına izin verilsin mi?" sorusuna izin verin ya da tüneli kullanın.

**Aynı ağda değilseniz (tünel):**

1. `npm run start:tunnel` (yani `npx expo start --tunnel`). SDK 57'de tünel ngrok ile açılır, Expo hesabı gerekmez; gereken `@expo/ngrok` paketi `mobile/package.json`'da geliştirme bağımlılığı olarak var.
2. Uygulama kodu internet üzerinden telefona gelir; telefon mobil veride olsa da çalışır. Terminalde "Tunnel ready." yazınca karekodu okutun.
3. SDK 57'de `--tunnel ngrok` yazmayın; `ngrok` kelimesi proje klasörü sanılır ve "Invalid project root" hatası verir.
4. Tünel açılmazsa: bilgisayarı telefonun kişisel erişim noktasına (hotspot) bağlayın, ikisi aynı ağda olur ve `npm run start` yeter.

**Kapatmak için:** Terminalde `Ctrl + C`.

**Bilmeniz gerekenler:**
- **API adresi:** Uygulama formları **canlı sitenin** API'sine (`https://lumie-mum-atolyesi.vercel.app`) gönderir. Uygulamadan yapılan geçerli bir gönderim gerçek webhook'a düşer; testte örnek bilgiler kullanın. Başka bir adres için uygulamayı `EXPO_PUBLIC_API_URL` ortam değişkeniyle başlatın.
- **İnternet:** Ürün fotoğrafları da canlı siteden yüklenir; internet yoksa alev simgesi görünür.
- **Paket kurma:** Uygulamaya paket eklerken `npm install` yerine `npx expo install <paket>` kullanın; SDK'ya uygun sürümü seçer. Expo Go yalnızca kendi içindeki yerel modülleri çalıştırır; yerel kod içeren bir paket eklenirse uygulama Expo Go'da açılmaz.
- **Uyumu kontrol:** `npx expo-doctor` ve `npx expo install --check`.

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
- Form alanlarının en fazla uzunlukları `src/data/webhook.js`'deki `FIELD_LIMITS`'tedir (ad 100, e-posta 254, telefon 20). Sunucu bu sınırları kontrol eder; formlardaki `maxLength` da aynı sabiti kullanır, sayı bileşene yazılmaz.
- Güvenlik başlıkları (CSP, X-Frame-Options vb.) `vercel.json`'dadır. Vercel bunları fonksiyon yanıtlarına eklemediği için API yanıtlarının başlıkları `api/_lib/handle-form.js`'te ayrıca eklenir. `npm run preview` aynı başlıklarla çalışır: CSP'yi değiştirdikten ya da başka bir alan adından kaynak (yazı tipi, görsel, betik) ekledikten sonra önce orada deneyin. `npm run dev`'e başlık uygulanmaz.
- Deploy öncesi kontroller ve bilinen eksikler `docs/guvenlik-kontrol-listesi.md`'dedir.
- **Telefon uygulaması (`mobile/`):** Expo + React Native, tek ekran.
  - **Paylaşılan veri:** Ürünler, kategoriler, doğrulama, `FIELD_LIMITS` ve politika sürümü **kopyalanmaz**, kökteki `src/data/` dosyalarından okunur (`mobile/metro.config.js`'deki `watchFolders`). Bu yüzden `src/data/` altındaki dosyalara tarayıcıya ya da Node'a özgü kod (`window`, `document`, `import.meta.env`, `process.env`) yazılmaz; üç ortamda da (web, telefon, sunucu) çalışmalıdırlar.
  - **Bileşenler:** `mobile/src/components/` altında, adları webdekilerle aynı. Stiller `StyleSheet` ile yazılır, CSS sınıfı yoktur.
  - **Renkler:** Palet `mobile/src/theme.js`'de **ikinci kez** yazılıdır (React Native CSS değişkeni okuyamaz). `src/index.css`'teki bir renk değişirse `theme.js` de güncellenmelidir.
  - **API:** Uygulama `sendOrder` / `sendStockNotification`'ı `{ baseUrl, source: 'lumie-mobile' }` ile çağırır. Webhook adresi ve diğer gizli bilgiler uygulamaya hiç girmez.
  - **Yayından ayrı:** `mobile/` web sitesinin parçası değildir. `.vercelignore` sayesinde `vercel deploy` bu klasörü yüklemez; Vite de yalnızca `index.html` ve `gizlilik.html`'i derler.
- Site iki sayfadan oluşur: `index.html` (mağaza) ve `gizlilik.html` (gizlilik politikası). İkisi de `vite.config.js`'deki `build.rollupOptions.input`'ta tanımlıdır; yeni bir sayfa eklenirse oraya da eklenmelidir.

## Yayına alma (Vercel)

1. vercel.com'da GitHub ile giriş yapın, **Add New → Project** ile `aysuyldrmm/lumie-mum-atolyesi` deposunu seçin. Framework "Vite" olarak kendiliğinden seçilir.
2. **Settings → Environment Variables** bölümüne `WEBHOOK_URL` ekleyin: **Production** için gerçek webhook adresi, **Preview** için webhook.site test adresi.
3. **Storage → Upstash (Redis)** ile ücretsiz bir veritabanı oluşturup projeye bağlayın. `KV_REST_API_URL` ve `KV_REST_API_TOKEN` değişkenlerini Vercel kendisi ekler; istek sınırı bunlarla çalışır.
4. Deploy edin. Sonrasında her `main` push'u yayına otomatik çıkar. Ortam değişkenlerini değiştirirseniz değişikliğin geçmesi için yeniden deploy edin.

## Formlar ve webhook

Karttaki düğme stoka göre değişir ve ilgili formu açılır pencerede açar. Formlar webhook'a şu alanları gönderir:

- **Sipariş Ver** (stokta olan ürünler): event, name, productId, productName, phone, email, quantity, consent, consentVersion, consentedAt, source
- **Stok Bildirimi İste** (tükenen ürünler): event, name, productId, productName, email, consent, consentVersion, consentedAt, source

`productId` ve `productName` ürün verisinden (`id`, `name`) alınır; formlar bunları kullanıcıdan istemez. `source` web sitesinden gelen kayıtlarda `"lumie-web"`, telefon uygulamasından gelenlerde `"lumie-mobile"`'dır.

## KVKK ve gizlilik

- İki formda da `ConsentField` bileşeni vardır: üstte kutucuksuz bir aydınlatma satırı, altında varsayılan olarak boş bir açık rıza kutucuğu. Kutucuk yalnızca **yurt dışına aktarım** içindir; aydınlatma ile açık rıza aynı kutucukta birleştirilmez.
- Kutucuk işaretlenmeden form gönderilemez; sunucu da `consent === true` olmayan isteği `400` ile reddeder.
- Gizlilik politikası ayrı bir sayfadır: `gizlilik.html` → `src/privacy.jsx` → `src/components/PrivacyPolicy.jsx`. Metin bir eğitim projesi için hazırlanmış **örnek taslaktır**; sayfanın başında bunu belirten bir not vardır ve içindeki işletme bilgileri (ad, adres, telefon, `.example` e-postaları, hizmet sağlayıcı bölgeleri, saklama süreleri) hayalidir. Gerçek bir işletmede bu bilgiler değiştirilmeli ve metin bir hukukçuya kontrol ettirilmelidir.
- Politika metni değiştiğinde `src/data/privacy.js`'deki `PRIVACY_POLICY_VERSION` güncellenir. Bu tarih sayfada "Son güncelleme" olarak görünür ve her onayla birlikte webhook'a `consentVersion` olarak gider.
- Yeni bir veri, hizmet sağlayıcı (ör. analiz aracı, çerez) ya da saklama yeri eklenirse gizlilik politikası da güncellenmelidir.

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
