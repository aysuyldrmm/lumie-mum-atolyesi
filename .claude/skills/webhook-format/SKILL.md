---
name: webhook-format
description: Lumie sitesindeki formlardan (Sipariş Ver, Stok Bildirimi İste) webhook'a veri gönderirken izlenecek kurallar: payload alanları, alan tipleri, event ve source değerleri, webhook.site ile test. Form, payload ya da webhook kodu yazılırken veya değiştirilirken kullan.
---

# Webhook formatı

## Genel

- İstek `POST` ile gönderilir, gövde JSON olur: `Content-Type: application/json`.
- Webhook adresi `import.meta.env.VITE_WEBHOOK_URL` değişkeninden okunur, koda yazılmaz.
- Payload'da **yalnızca** aşağıda listelenen alanlar bulunur. Fazla alan (fiyat, kategori, zaman damgası vb.) ya da eksik alan olmaz.
- `event`, `source`, `productId` ve `productName` formlar tarafından değil, payload'ı oluşturan ortak fonksiyonlar tarafından doldurulur. Kullanıcı bu alanları göremez ve değiştiremez.

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
- Gönderim başarısız olursa (ağ hatası ya da 2xx dışında bir yanıt) kullanıcıya hata mesajı gösterilir ve girdiği bilgiler silinmez.

## webhook.site ile test

1. https://webhook.site adresini açın. Sayfa size özel bir adres verir (`https://webhook.site/<kimlik>`). Bu adresi kopyalayın.
2. Proje kökünde bir `.env.local` dosyası oluşturun:
   ```
   VITE_WEBHOOK_URL=https://webhook.site/<kimlik>
   ```
   `.env.local` commit'lenmemeli; `.gitignore`'da yoksa önce oraya eklenmeli.
3. `npm run dev` sunucusunu yeniden başlatın. Vite `.env` dosyalarını yalnızca açılışta okur.
4. Stokta olan bir üründen sipariş, tükenen bir üründen stok bildirimi gönderin.
5. webhook.site sayfasında gelen isteklerin her biri için şunları kontrol edin:
   - Yöntem `POST`, `Content-Type` `application/json`.
   - Alanlar yukarıdaki tablolarla birebir aynı, eksik ya da fazla alan yok.
   - `quantity` tırnaksız bir sayı (`2`), `phone` tırnaklı bir metin (`"0532..."`).
   - `event` ve `source` değerleri doğru.
6. Tarayıcı isteği CORS hatasıyla engellerse webhook.site'ın ayarlarından CORS başlıklarını açın.
7. webhook.site adresini bilen herkes gelen istekleri görebilir. Testte gerçek müşteri bilgisi değil, örnek ad, e-posta ve telefon kullanın.
