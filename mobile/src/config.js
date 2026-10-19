// Uygulamanın konuştuğu web sitesi. Formlar bu sitenin API route'larına gider,
// ürün fotoğrafları ve gizlilik politikası da buradan açılır. Bu adres gizli
// değildir; webhook adresi ve diğer gizli bilgiler yalnızca sitenin sunucusundadır.
// Test için `EXPO_PUBLIC_API_URL` ile başka bir adres verilebilir.
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'https://lumie-mum-atolyesi.vercel.app'
).replace(/\/$/, '')

export const SOURCE = 'lumie-mobile'
