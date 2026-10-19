# Deploy öncesi güvenlik kontrol listesi

Lumie Mum Atölyesi sitesi için hazırlanmıştır. Her maddede kontrolün nasıl yapıldığı (dosya, komut, test) ve sonucu yazılıdır. Gizli değerler (webhook adresi, Upstash anahtarları) bu belgeye bilerek yazılmamıştır; komutlar bu değerleri `.env.local`'dan okuyup yalnızca eşleşme **sayısını** gösterir.

- **Kontrol tarihi:** 19 Ekim 2026
- **İlk kontrol:** commit `34cf1b1`, deploy `lumie-mum-atolyesi-4vk3isyth`
- **Son güncelleme:** commit `f029702`, deploy `lumie-mum-atolyesi-8kj1kz3i7`. Alan uzunluğu sınırları (madde 3) ve güvenlik başlıkları (madde 8) eklenip yayında yeniden test edildi.
- **Kontrol edilen yayın:** https://lumie-mum-atolyesi.vercel.app

**Durum işaretleri:** ✅ tamam · ⚠️ çalışıyor ama sınırı / riski var · ❌ yapılmamış ya da eksik

## Özet

| # | Konu | Durum |
|---|---|---|
| 1 | `.env` dosyaları hiç commit'lenmemiş | ✅ |
| 2 | Webhook adresi tarayıcı koduna girmiyor | ✅ |
| 3 | Sunucu tarafı doğrulama | ✅ Alan uzunluğu sınırları eklendi |
| 4 | Rate limit | ⚠️ Çalışıyor, bilinen sınırları var |
| 5 | KVKK onayı ve gizlilik politikası | ⚠️ Teknik olarak tamam, hukuki olarak eksik |
| 6 | Vercel'deki gizli ayarlar | ✅ Birkaç küçük not |
| 7 | Bağımlılıklar | ✅ |
| 8 | HTTPS ve güvenlik başlıkları | ✅ Eklendi, yayında doğrulandı |
| 9 | Webhook'un kendisinin korunması | ❌ İmza ya da gizli anahtar yok |
| 10 | Bot koruması | ❌ Yok |
| 11 | Deploy süreci | ⚠️ GitHub bağlantısı yok, deploy'lar elle yapılıyor |

---

## 1. `.env` dosyaları hiçbir zaman commit'lenmemiş ✅

**Kontroller:**

| Komut | Sonuç |
|---|---|
| `git log --all --name-only -- '.env*'` | Yalnızca `.env.example` görünüyor (commit `5ac1f7f` ve `7c8b8f0`). Başka hiçbir `.env*` dosyası geçmişte yok. |
| `git ls-files \| grep '\.env'` | Takip edilen tek dosya `.env.example`. |
| `.env.example` içeriği | `WEBHOOK_URL=`, `KV_REST_API_URL=`, `KV_REST_API_TOKEN=`: üçünün de değeri boş. |
| `git log --all -S "<webhook adresinin kimlik kısmı>"` | 0 commit. Test webhook adresi geçmişin hiçbir yerinde yok. |
| `git log --all -p \| grep -cE 'webhook\.site/[0-9a-f-]{36}'` | 0 |
| `git log --all -p \| grep -c 'upstash\.io'` | 0 |
| `git log --all -p \| grep -cE 'eyJ…'` (JWT / uzun anahtar deseni) | 0 |
| Değer atanmış `WEBHOOK_URL=` / `KV_REST_API_TOKEN=` / `VERCEL_OIDC_TOKEN=` satırları | 2 satır, ikisi de `webhook-format` skill'indeki `https://webhook.site/<kimlik>` yer tutuculu örnek (commit `70da70d`, `5ac1f7f`). Gerçek değer değil. |

- Toplam 22 commit, tüm dallar (`main`, `kategori-filtresi`, `origin/main`) tarandı.
- **`.gitignore` kuralları** (`git check-ignore` ile denendi): `.env`, `.env.local`, `.env.production`, `.env.development.local` ve `.vercel/project.json` yok sayılıyor; `.env.example` takip ediliyor. Kural: `.env*` + `!.env.example` + `.vercel`.
- **Not:** Yerel `.env.local` içinde `WEBHOOK_URL` ve Vercel CLI'ın eklediği kısa ömürlü `VERCEL_OIDC_TOKEN` var. İkisi de yok sayılıyor ve hiç commit'lenmedi.

## 2. Webhook adresi tarayıcı koduna girmiyor ✅

**Kaynak kod:**
- `grep -rnE 'import\.meta\.env|VITE_' src index.html gizlilik.html` → eşleşme yok.
- `process.env` yalnızca sunucu tarafında kullanılıyor: `api/_lib/handle-form.js` ve `api/_lib/rate-limit.js`, ayrıca yalnızca geliştirme sunucusunda çalışan `vite.config.js`.
- Webhook adresinin değişkeni `WEBHOOK_URL`. `VITE_` öneki olmadığı için Vite bunu tarayıcı koduna koymaz.

**Yerel derleme** (`rm -rf dist && npm run build`, ardından `dist/` içinde arama):

| Aranan | Eşleşen dosya |
|---|---|
| Test webhook adresinin tamamı | 0 |
| `webhook.site` | 0 |
| `WEBHOOK_URL` | 0 |
| `KV_REST` | 0 |
| `upstash.io` | 0 |
| `process.env` | 0 |

**Yayındaki site:** `index.html` ve `gizlilik.html`'nin yüklediği 4 JS dosyası indirilip arandı.
- Test webhook adresi, `webhook.site`, `hook.*.make.com` / `hooks.zapier` / `script.google`, `WEBHOOK_URL`, `KV_REST`, `upstash.io` → hepsi 0.
- Tarayıcı yalnızca `/api/order` ve `/api/stock-notification` adreslerine istek atıyor. Bu, tarayıcı testlerinde ağ istekleri kaydedilerek doğrulandı.

**Sınır:** Production'daki gerçek webhook adresini bilmediğimiz için yayındaki kodda o adres doğrudan aranamadı. Bilinen tüm webhook servisi desenleri ve değişken adları arandı. Kodda adresin tarayıcıya gidebileceği bir yol yok.

## 3. Sunucu tarafı doğrulama ✅

**Akış** (`api/_lib/handle-form.js`):
1. Rate limit.
2. JSON'u okuma.
3. Ürünü `productId` ile `src/data/products.js`'ten bulma ve stok durumunu kontrol etme.
4. Alan doğrulaması (`src/data/webhook.js`'deki `validateOrder` / `validateStockNotification`; tarayıcıdakiyle aynı fonksiyonlar).
5. Payload'ı sunucuda hazırlama.
6. Webhook'a gönderme.

Tarayıcıdan gelen `productName`, `event`, `source`, `consentVersion`, `consentedAt` yok sayılıyor.

**Yayında yapılan test** (curl, 19 Ekim 2026, yeni bir dakika diliminin başında; hiçbir istek webhook'a ulaşmadı):

| İstek | Beklenen | Sonuç |
|---|---|---|
| Bozuk JSON | 400 | ✅ 400 `Geçersiz istek.` |
| JSON dizi `[1,2]` | 400 | ✅ 400 |
| Bilinmeyen `productId` | 400 | ✅ 400 |
| Tükenmiş ürüne sipariş | 400 | ✅ 400 |
| Stokta olan ürüne stok bildirimi | 400 | ✅ 400 |
| Stoktan fazla adet (13 > 12) | 400 + `errors.quantity` | ✅ |
| Çift noktalı e-posta | 400 + `errors.email` | ✅ |
| Harfli telefon | 400 + `errors.phone` | ✅ |
| Onay yok | 400 + `errors.consent` | ✅ |
| Onay `"true"` (metin) | 400 + `errors.consent` | ✅ |
| `GET /api/order` | 405 | ✅ 405 |

**Yerelde yapılan testler** (yakalama sunucusuyla, önceki oturumlarda):
- Sahte `productName` / `event` / `source` / `price` yok sayıldı; webhook'a gerçek değerler gitti.
- 18 e-posta uç durumunun hepsi beklenen sonucu verdi.
- `WEBHOOK_URL` tanımsızken 500, webhook hata verdiğinde 502 döndü; formda genel hata göründü ve bilgiler silinmedi.

**✅ Alan uzunluğu sınırları (commit `a6e8dc3`'te eklendi).**
- **Önceki durum:** İlk kontrolde uzunluk sınırı yoktu. Yerel testte 100.000 karakterlik bir ad `200` almış ve webhook'a 100.000 karakter olarak ulaşmıştı.
- **Kod:** `src/data/webhook.js`'deki `FIELD_LIMITS = { name: 100, email: 254, phone: 20 }`. Değerler boşluklar temizlendikten sonra kontrol ediliyor. E-postanın uzunluğuna diğer e-posta kontrollerinden önce bakılıyor, böylece çok uzun bir metin işlenmiyor. Formlardaki `maxLength` aynı sabiti kullanıyor (`OrderForm.jsx`, `StockNotificationForm.jsx`).
- **Kenar değer testi:** `validateOrder`'ı doğrudan çalıştıran bir betikle yapıldı.

| Girdi | Sonuç |
|---|---|
| Ad 100 karakter / 101 karakter | kabul / `Adınız en fazla 100 karakter olabilir.` |
| Ad 100 karakter + baştaki ve sondaki boşluk | kabul (boşluklar sayılmıyor) |
| E-posta 254 / 255 karakter | kabul / `E-posta adresi en fazla 254 karakter olabilir.` |
| E-posta 1.000.000 karakter | ret, 1 ms'de |
| Telefon 20 / 21 rakam | kabul / `Telefon numarası en fazla 20 karakter olabilir.` |
| `0532 123 45 67` (temizlenince 11) | kabul |

- **Yayında test (curl):**

| Girdi | Sonuç |
|---|---|
| 100.000 karakterlik ad | ✅ `400` + `errors.name` |
| 101 karakterlik ad | ✅ `400` |
| 21 haneli telefon | ✅ `400` + `errors.phone` |
| 310 karakterlik e-posta | ✅ `400` + `errors.email` |

- **Tarayıcı (yayında):** Ad alanına 150 karakter yazılmaya çalışıldığında alan 100 karakterde duruyor. `maxLength` değerleri: ad 100, telefon 20, e-posta 254.
- **Gerileme:** 18 e-posta testinin hepsi ve onay kutucuğu testleri, güvenlik başlıklı yerel önizlemede (`npm run preview`) yeniden geçti.

## 4. Rate limit ⚠️

**Kod:** `api/_lib/rate-limit.js`. Aynı IP'den 60 saniyede en fazla 10 istek; iki route aynı sayacı paylaşıyor. Sayaç `@upstash/ratelimit` ile Upstash Redis'te tutuluyor (`slidingWindow`).

**Yayında yapılan test** (yukarıdaki 10 doğrulama isteğinin hemen ardından, aynı dakika diliminde):
- 11'inci istek → ✅ `429`, gövde `{"error":"Çok fazla istek.","retryAfter":53}`.
- 12'nci istek, `X-Forwarded-For: 1.2.3.4` ve `X-Real-IP: 1.2.3.4` başlıklarıyla → ✅ `429`. Ziyaretçi IP başlığını değiştirerek sınırı aşamıyor, çünkü Vercel bu başlıkların üzerine yazıyor.
- `Retry-After: 51` başlığı geliyor.
- Sipariş ve stok bildirimi route'ları Vercel'de ayrı fonksiyonlar. 5 + 5 isteğin ardından reddedilmeleri, sayacın Upstash'te ortak tutulduğunu gösteriyor.
- Sınır aşılınca formda "Kısa sürede çok fazla deneme yapıldı…" mesajı görünüyor ve bilgiler silinmiyor (yayında tarayıcıyla test edildi).
- `vercel logs --deployment … --since 15m` → Upstash zaman aşımı ya da hata uyarısı yok.

**Bilinen sınırlar (bilinçli tercihler):**
- **Esneme:** Upstash'in kayan penceresi yaklaşık hesap yapıyor. Dakika geçişlerinde 1–2 istek fazladan geçebiliyor; bir testte 11'inci istek geçti, 12'nci reddedildi.
- **Upstash yanıt vermezse:** 1 saniye sonra istek kabul ediliyor ("fail open") ve durum loga yazılıyor. Arızada siparişler durmuyor, ama o sırada sınır da çalışmıyor. Bu durum yerelde ulaşılamayan bir Upstash adresiyle test edildi.
- **Paylaşılan IP:** Mobil operatörlerin IP paylaşımı nedeniyle aynı IP'deki farklı kişiler aynı sayacı paylaşabilir.
- **Kapsam:** Tek bir kaynaktan gelen yoğun istekleri durdurur, farklı IP'lerden gelen dağınık spam'i durdurmaz (bkz. madde 10).

## 5. KVKK onayı ve gizlilik politikası ⚠️

**Teknik olarak yapılanlar ✅**
- **Formlar:** İki formda da `src/components/ConsentField.jsx` var: kutucuksuz bir aydınlatma satırı ve varsayılan olarak boş, yurt dışına aktarım için açık rıza kutucuğu. Gizlilik bağlantıları yeni sekmede açılıyor (`target="_blank" rel="noopener"`).
- **Yayında tarayıcı testi:** İki formda da kutucuk başlangıçta boş. İşaretlemeden gönderilince hata kutucuğun altında görünüyor ve sunucuya **hiç istek gitmiyor**.
- **Sunucu:** `api/_lib/handle-form.js` içinde `values.consent = body.consent === true`. Yayında onaysız istek ve `"true"` metni `400` aldı (madde 3).
- **Onay kaydı:** Payload'a `consent`, `consentVersion` (`src/data/privacy.js`) ve `consentedAt` (sunucu saati) ekleniyor. Yerelde yakalama sunucusuyla doğrulandı; tarayıcıdan gönderilen sahte sürüm ve saat yok sayıldı.
- **Gizlilik sayfası:** `/gizlilik.html` yayında `200`. Eğitim notu ve "Son güncelleme: 19 Ekim 2026" görünüyor; ana sayfa alt bilgisinde bağlantısı var.
- **Çerez ve depolama:** Kodda `document.cookie`, `localStorage`, `sessionStorage` yok; yayındaki sayfa ve API `Set-Cookie` göndermiyor. Politikadaki "çerez kullanmıyoruz" ifadesi doğru.
- **IP saklama süresi:** Upstash'teki IP sayacının ömrü kütüphane kodunda `PEXPIRE window * 2 + 1000` ms, yani yaklaşık 2 dakika. Politikadaki süre bununla uyumlu.

**Eksik ya da riskli ❌⚠️**
- **❌ Gizlilik metni hayali bilgiler içeriyor ve yayında.** İşletme adı, adres, telefon, `.example` e-postaları, hizmet sağlayıcı bölgeleri, standart sözleşme ve VERBİS ifadeleri ile saklama süreleri eğitim projesi için uydurulmuş. Sayfanın başında bunu söyleyen bir not var, ama gerçek bir işletmede bu metinle yayına çıkılmamalı.
- **⚠️ Yurt dışına aktarımın dayanağı.** KVKK m.9'un 2024 değişikliğinden sonra açık rıza, bildiğimiz kadarıyla yalnızca arızi (ara sıra yapılan) aktarımlar için geçerli bir dayanak. Vercel ve Upstash'e aktarım her siparişte düzenli olarak yapılıyor; bu yüzden standart sözleşme ve Kurul'a bildirim gerekebilir. Metin bir hukukçuya kontrol ettirilmedi.
- **⚠️ Upstash bölgesi doğrulanmadı.** Metinde "ABD, Kuzey Virginia" yazıyor, ama gerçek veritabanı bölgesi kontrol edilmedi. Vercel panelinde **Storage → Upstash** altında bakılmalı.
- **⚠️ Rızanın geri alınması elle yürüyor.** Sitede rızayı geri alma ya da veri silme talebi için bir form yok; politika e-posta ve posta yoluyla başvuruyu tarif ediyor. Küçük bir işletme için yeterli olabilir.
- **⚠️ Sunucu loglarında IP bulunabilir.** Kodumuz loglara kişisel veri yazmıyor (`api/` altındaki 4 `console.error` satırı yalnızca hata mesajı içeriyor). Ama Vercel'in kendi erişim kayıtları IP içerebilir; politikada bu belirtildi.

## 6. Vercel'deki gizli ayarlar ✅

**`vercel env ls`:**

| Değişken | Ortam | Kullanılıyor mu |
|---|---|---|
| `WEBHOOK_URL` | Production | Evet (gerçek adres) |
| `WEBHOOK_URL` | Preview | Evet (webhook.site test adresi) |
| `KV_REST_API_URL` | Preview, Production | Evet |
| `KV_REST_API_TOKEN` | Preview, Production | Evet |
| `KV_URL`, `KV_REDIS_URL`, `KV_REST_API_READ_ONLY_TOKEN` | Preview, Production | Hayır (Upstash entegrasyonu ekledi) |

- **Gizlilik:** Hepsinin tipi "Secret"; değerler CLI'da "Hidden" görünüyor.
- **Önek:** `VITE_` önekli değişken sayısı 0. Tarayıcı koduna gömülebilecek bir değişken yok.
- **Development ortamı:** Hiç değişken yok. Yerel geliştirme `.env.local` ile yapılıyor; bu dosya Vercel'e yüklenmiyor.
- **Deploy adresleri korumalı:** Deploy'a özel adresler giriş istiyor. Örneğin `lumie-mum-atolyesi-pt2f2i1ox-aysuy.vercel.app` → `302`, `vercel.com/sso-api`'ye yönlendiriyor. Kod ya da ayarları eski olan deploy'lar herkese açık değil; yalnızca `lumie-mum-atolyesi.vercel.app` herkese açık.
- **Sunucu bölgesi:** `iad1` (ABD). Politikadaki "Vercel Inc. (ABD)" ifadesiyle uyumlu.

**Notlar:**
- **Production adresi doğrulanmadı.** Production'daki `WEBHOOK_URL`'in doğru adres olduğu (ör. webhook.site değil) bizim tarafımızdan doğrulanamaz, çünkü değer gizli. Gerçek webhook'a sahte kayıt düşmemesi için yayında geçerli bir gönderim yapılmadı; bunu site sahibinin örnek bilgilerle denemesi gerekiyor.
- **Preview'daki webhook.site adresi.** Bu adresi bilen herkes gelen istekleri görebilir. Preview'da yalnızca örnek bilgilerle test yapılmalı.
- **Kullanılmayan değişkenler.** `KV_URL`, `KV_REDIS_URL` ve `KV_REST_API_READ_ONLY_TOKEN` kullanılmıyor. En az yetki ilkesi için silinebilirler, ama Upstash entegrasyonu bunları yeniden ekleyebilir; risk düşük.

## 7. Bağımlılıklar ✅

- `npm audit --omit=dev` → `found 0 vulnerabilities`
- `npm audit` (geliştirme bağımlılıkları dahil) → `found 0 vulnerabilities`
- `package-lock.json` commit'li; Vercel aynı sürümleri kuruyor.
- `@upstash/ratelimit@2.2.0` ve `@upstash/redis@1.39.0`, eklendikleri gün yaklaşık 4 haftalık sürümlerdi (`npm view … time`). Yeni yayınlanmış, denenmemiş sürümler değiller.

## 8. HTTPS ve güvenlik başlıkları ✅

**Önceki durum:** İlk kontrolde (`34cf1b1`) yalnızca HSTS vardı. CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy ve Permissions-Policy eksikti; `vercel.json` yoktu.

**Kod (commit `a6e8dc3`, `f029702`):**
- **`vercel.json`:** Sayfalar ve dosyalar için şu başlıklar gönderiliyor:
  - `Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()`
  - `Cross-Origin-Opener-Policy: same-origin`
- **`api/_lib/handle-form.js`:** Vercel, `vercel.json` başlıklarını fonksiyon yanıtlarına **eklemiyor**; bunu yayında gördük (`POST /api/order`: 0/7 başlık). Bu yüzden API yanıtlarına `X-Content-Type-Options: nosniff`, `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` ve `Cache-Control: no-store` kodda ekleniyor.
- **`vite.config.js`:** `npm run preview` aynı başlıkları `vercel.json`'dan okuyup gönderiyor ve API route'larını da çalıştırıyor. Böylece CSP yayına çıkmadan yerelde test edilebiliyor. `npm run dev`'e başlık uygulanmıyor, çünkü Vite'ın anlık yenileme betikleri CSP'ye takılır.

**Yayında test (deploy `8kj1kz3i7`):**

| Kontrol | Sonuç |
|---|---|
| `curl -sI /` — 6 yeni başlık + HSTS | ✅ 7/7 |
| `curl -sI /gizlilik.html` | ✅ 7/7 |
| `curl -sI /assets/main-….js` | ✅ 7/7 |
| API yanıtları: `400`, `429` (3 API başlığı) | ✅ 3/3 |
| `http://` → `https://` | ✅ `308` |
| CSP ihlali (tarayıcıda `securitypolicyviolation` olayı dinlendi): ana sayfa, gizlilik sayfası, form açma ve gönderme | ✅ 0 ihlal |
| Sayfa çalışıyor mu (CSP bir şeyi bozdu mu) | ✅ İki sayfa da çiziliyor, 3/3 ürün görseli yükleniyor, karekod (SVG) görünüyor, stiller uygulanıyor |
| Siteyi başka bir sayfada `<iframe>` ile gömme denemesi | ✅ Engellendi (çerçeve `chrome-error://chromewebdata/` gösteriyor) |
| Yerel önizlemede formun CSP altında gönderilmesi (yakalama sunucusuyla) | ✅ Başarılı, webhook'a ulaştı |

**Kalan küçük not:** Sitede `favicon.ico` yok, tarayıcı konsolunda bir `404` görünüyor. Güvenlik sorunu değil; bu değişiklikten önce de vardı.

**CORS:** Başka bir siteden gelen ön kontrol isteği (`OPTIONS /api/order`, `Origin: https://kotu-site.example`) `405` alıyor ve `Access-Control-Allow-*` başlığı dönmüyor. Başka sitelerin tarayıcıları API'ye JSON gönderemiyor. curl gibi araçlar gönderebilir, ama onları sunucu doğrulaması ve rate limit karşılıyor.

## 9. Webhook'un kendisinin korunması ❌

**Kod:** `api/_lib/handle-form.js` webhook'a yalnızca `Content-Type: application/json` başlığıyla istek atıyor; imza ya da gizli anahtar yok.

**Etki:** Webhook adresi bir gün sızarsa (ör. bir ekran görüntüsünde ya da yanlışlıkla paylaşılan bir dosyada), biri doğrudan webhook'a sahte sipariş gönderebilir. Webhook tarafı, isteğin bizim sunucumuzdan geldiğini ayırt edemez. Sunucu doğrulaması ve rate limit bu durumda devre dışı kalır.

**Öneri:**
- Vercel'e bir `WEBHOOK_SECRET` eklensin; sunucu bunu bir başlıkta göndersin (ya da gövdeyi HMAC ile imzalasın).
- Webhook tarafında (Make, Zapier vb.) bu başlığı kontrol eden bir filtre kurulsun.
- Adres sızarsa webhook servisinde yeni bir adres alınıp Vercel'deki değer güncellenmeli.

## 10. Bot koruması ❌

**Kontrol:** `grep -rliE 'captcha|turnstile|honeypot' src api` → 0 dosya.

**Etki:** Rate limit tek bir IP'yi durduruyor. Farklı IP'lerden gelen otomatik form doldurmayı engelleyen bir şey yok. Bu tür kayıtlar geçerli göründüğü sürece webhook'a ulaşır.

**Öneri:** Önce kullanıcıyı hiç rahatsız etmeyen bir **tuzak alanı** (honeypot: gizli bir input; doluysa sunucu isteği sessizce reddeder) eklensin. Spam görülürse Cloudflare Turnstile gibi görünmez bir doğrulama düşünülebilir. Turnstile yeni bir yurt dışı hizmet sağlayıcı demek olduğundan gizlilik politikasına da eklenmeli.

## 11. Deploy süreci ⚠️

**Kontroller:**
- `vercel project inspect lumie-mum-atolyesi --json` → Git bağlantısı yok (`link: null`).
- `vercel ls` → 4 deploy var, hepsi `aysuyldrmm` tarafından CLI ile elle yapılmış. Push'lardan sonra otomatik deploy olmamış.

**Riskler:**
- **Yerel değişiklikler yayına çıkabilir.** `vercel deploy` GitHub'daki kodu değil, **bilgisayardaki klasörü** yükler. Commit'lenmemiş bir değişiklik ya da yanlışlıkla klasöre konmuş bir dosya yayına çıkabilir.
- **Yayındaki kod ile commit eşleşmeyebilir.** Bu oturumda her deploy'dan önce `git status` temizdi ve yerel `main` ile `origin/main` aynıydı. Ama bu bir alışkanlık, otomatik bir güvence değil.
- **Ne korur:** `.env.local` gibi dosyaları Vercel CLI yüklemiyor, çünkü `.gitignore`'a uyuyor. Ortam değişkenleri yalnızca Vercel panelinden geliyor.

**Öneri:** Vercel panelinde **Settings → Git → Connect Git Repository** ile GitHub bağlantısı kurulsun. Böylece yayına yalnızca `main`'e push'lanmış kod çıkar ve her deploy bir commit'e bağlanır.

---

## Deploy öncesi kısa kontrol (her seferinde)

```bash
git status --short                 # boş olmalı
git log --oneline origin/main..main  # boş olmalı (her şey push'lanmış)
npm audit --omit=dev               # 0 vulnerabilities
npm run build                      # hatasız
grep -rlE 'webhook\.site|WEBHOOK_URL|KV_REST|upstash\.io' dist  # çıktı vermemeli
vercel env ls                      # VITE_ önekli değişken olmamalı
npm run preview                    # CSP açıkken sayfalar ve formlar çalışıyor mu (tarayıcı konsolunda "Content Security Policy" hatası olmamalı)
```

`vercel.json`'daki CSP'yi değiştirirseniz ya da siteye başka bir alan adından dosya (yazı tipi, görsel, analiz betiği) eklerseniz, önce `npm run preview` ile deneyin. CSP izin vermeyen kaynakları sessizce engeller.

Deploy'dan sonra:
- `curl -sI https://lumie-mum-atolyesi.vercel.app/` ile güvenlik başlıkları görünmeli.
- Yayında kutucuk işaretlenmeden form gönderilemediği denenmeli.
- Örnek bilgilerle bir sipariş ve bir stok bildirimi gönderilip webhook tarafında `consent`, `consentVersion`, `consentedAt` alanlarının geldiği kontrol edilmeli.

## Öncelik sırasıyla yapılacaklar

1. **Gerçek yayından önce:** Gizlilik metnindeki hayali bilgileri gerçekleriyle değiştirin ve metni bir hukukçuya kontrol ettirin (madde 5).
2. Webhook'a giden isteklere gizli bir anahtar ekleyin (madde 9).
3. Vercel–GitHub bağlantısını kurun (madde 11).
4. Formlara tuzak alanı (honeypot) ekleyin (madde 10).
5. Yayında örnek bilgilerle bir gönderim yapıp Production `WEBHOOK_URL`'ini doğrulayın; Upstash bölgesini panelden kontrol edin (madde 5, 6).

**Tamamlananlar:**
- ✅ Alan uzunluğu sınırları (madde 3, commit `a6e8dc3`)
- ✅ Güvenlik başlıkları (madde 8, commit `a6e8dc3` ve `f029702`)
