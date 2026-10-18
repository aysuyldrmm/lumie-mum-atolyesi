---
name: webhook-format
description: Lumie sitesindeki formlardan (Sipariş Ver, Stok Bildirimi İste) webhook'a veri gönderirken izlenecek kurallar: payload alanları, alan tipleri, event ve source değerleri, webhook.site ile test. Form, payload ya da webhook kodu yazılırken veya değiştirilirken kullan.
---

# Webhook formatı

## Genel

- Akış: tarayıcı → sitenin API route'u (`/api/order`, `/api/stock-notification`) → webhook. Tarayıcı webhook'a **asla** doğrudan gitmez.
- Tarayıcı API route'una yalnızca `productId` ve formun alanlarını gönderir. Sunucu ürünü `products.js`'ten bulur, doğrulamayı (`validateOrder` / `validateStockNotification`) yeniden yapar ve payload'ı kendisi hazırlar.
- Webhook'a giden istek `POST` ile gönderilir, gövde JSON olur: `Content-Type: application/json`.
- Webhook adresi yalnızca sunucuda `process.env.WEBHOOK_URL`'den okunur. `VITE_` önekli bir değişken ya da `import.meta.env` kullanılmaz, çünkü bunlar tarayıcı koduna gömülür.
- Payload'da **yalnızca** aşağıda listelenen alanlar bulunur. Fazla alan (fiyat, kategori, zaman damgası vb.) ya da eksik alan olmaz.
- `event`, `source`, `productId` ve `productName` sunucuda, payload'ı oluşturan ortak fonksiyonlar tarafından doldurulur. Tarayıcıdan bu adlarla bir değer gelse bile yok sayılır.

## Sipariş Ver

Yalnızca stokta olan ürünler için, yani `isSoldOut(product)` yanlışsa gösterilir.

| Alan | Tip | Değer / kural |
|---|---|---|
| `event` | string | Sabit: `"order_created"` |
| `name` | string | Kullanıcının adı; baştaki ve sondaki boşluklar silinir, boş olamaz |
| `productId` | string | `product.id` |
| `productName` | string | `product.name` |
| `phone` | string | Boşluklar silinir; **sayıya çevrilmez**, çünkü baştaki `0` ya da `+` kaybolur |
| `email` | string | Baştaki ve sondaki boşluklar silinir, küçük harfe çevrilir, geçerli e-posta biçiminde olmalı |
| `quantity` | number (tam sayı) | **Metin değil, sayı:** `2`, `"2"` değil. En az `1`, en fazla `product.stock` |
| `source` | string | Sabit: `"lumie-web"` |

Örnek:

```json
{
  "event": "order_created",
  "name": "Ayşe Yılmaz",
  "productId": "lavanta-ruyasi",
  "productName": "Lavanta Rüyası",
  "phone": "05321234567",
  "email": "ayse@example.com",
  "quantity": 2,
  "source": "lumie-web"
}
```

## Stok Bildirimi İste

Yalnızca tükenen ürünler için, yani `isSoldOut(product)` doğruysa gösterilir.

| Alan | Tip | Değer / kural |
|---|---|---|
| `event` | string | Sabit: `"stock_notification_requested"` |
| `name` | string | Kullanıcının adı; baştaki ve sondaki boşluklar silinir, boş olamaz |
| `productId` | string | `product.id` |
| `productName` | string | `product.name` |
| `email` | string | Baştaki ve sondaki boşluklar silinir, küçük harfe çevrilir, geçerli e-posta biçiminde olmalı |
| `source` | string | Sabit: `"lumie-web"` |

Örnek:

```json
{
  "event": "stock_notification_requested",
  "name": "Ayşe Yılmaz",
  "productId": "amber-aksami",
  "productName": "Amber Akşamı",
  "email": "ayse@example.com",
  "source": "lumie-web"
}
```

## Dikkat edilecekler

- `<input type="number">` alanının değeri **metin** olarak gelir. `quantity` alanına koymadan önce `Number(...)` ile sayıya çevrilir.
- Ürün `id` değerleri değiştirilmez, çünkü webhook tarafında ürünler bu kimliklerle eşleştirilir.
- Gönderim başarısız olursa (ağ hatası ya da 2xx dışında bir yanıt) kullanıcıya hata mesajı gösterilir ve girdiği bilgiler silinmez. API route alan hatası dönerse (`400` ve `{ errors }`) hata ilgili alanın altında gösterilir.
- API route yanıtları: geçersiz istek, bilinmeyen ya da uygun olmayan ürün, doğrulama hatası → `400`; `WEBHOOK_URL` tanımsız → `500`; webhook hatası ya da zaman aşımı → `502`; başarı → `200`.

## webhook.site ile test

1. https://webhook.site adresini açın. Sayfa size özel bir adres verir (`https://webhook.site/<kimlik>`). Bu adresi kopyalayın.
2. `.env.example`'ı proje kökünde `.env.local` adıyla kopyalayıp adresi yazın:
   ```
   WEBHOOK_URL=https://webhook.site/<kimlik>
   ```
   `.env.local` commit'lenmez; `.gitignore`'daki `.env*` kuralı bunu sağlar.
3. `npm run dev` sunucusunu yeniden başlatın. Ortam dosyaları yalnızca açılışta okunur.
4. Stokta olan bir üründen sipariş, tükenen bir üründen stok bildirimi gönderin.
5. webhook.site sayfasında gelen isteklerin her biri için şunları kontrol edin:
   - Yöntem `POST`, `Content-Type` `application/json`.
   - Alanlar yukarıdaki tablolarla birebir aynı, eksik ya da fazla alan yok.
   - `quantity` tırnaksız bir sayı (`2`), `phone` tırnaklı bir metin (`"0532..."`).
   - `event` ve `source` değerleri doğru.
6. Tarayıcının ağ sekmesinde yalnızca `/api/...` isteği görünmeli; webhook adresi tarayıcıda hiçbir yerde görünmemeli. İstek sunucudan gittiği için CORS ayarı gerekmez.
7. webhook.site adresini bilen herkes gelen istekleri görebilir. Testte gerçek müşteri bilgisi değil, örnek ad, e-posta ve telefon kullanın.
