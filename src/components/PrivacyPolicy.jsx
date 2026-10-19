import { PRIVACY_POLICY_VERSION } from '../data/privacy.js'

// TASLAK: Hukuki danışmanlık değildir; yayına almadan önce bir hukukçuya
// kontrol ettirilmelidir. Köşeli parantezli yerler işletme tarafından doldurulur.
const fill = (text) => <span className="yer-tutucu">[{text}]</span>

const versionDate = new Date(`${PRIVACY_POLICY_VERSION}T00:00:00Z`).toLocaleDateString('tr-TR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
})

export default function PrivacyPolicy() {
  return (
    <>
      <header>
        <h1>Lumie <span>Mum Atölyesi</span></h1>
        <p className="slogan">Gizlilik Politikası ve Aydınlatma Metni</p>
      </header>

      <main>
        <article className="gizlilik">
          <p className="ana-sayfa-baglantisi">
            <a href="/">← Ana sayfaya dön</a>
          </p>
          <p className="gizlilik-tarih">Son güncelleme: {versionDate}</p>

          <p>
            Bu metin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında, web
            sitemizdeki sipariş ve stok bildirimi formları aracılığıyla paylaştığınız kişisel
            verilerin nasıl işlendiğini açıklar.
          </p>

          <h2>1. Veri sorumlusu</h2>
          <p>
            Kişisel verileriniz, veri sorumlusu sıfatıyla {fill('işletme unvanı')} tarafından
            işlenir.
          </p>
          <ul>
            <li>Adres: {fill('açık adres')}</li>
            <li>E-posta: {fill('iletişim e-postası')}</li>
            <li>Telefon: {fill('telefon')}</li>
            <li>VERBİS kayıt numarası: {fill('varsa kayıt numarası; yoksa bu satırı silin')}</li>
          </ul>

          <h2>2. Hangi kişisel verileri işliyoruz?</h2>
          <ul>
            <li>
              <strong>Sipariş formu:</strong> adınız, telefon numaranız, e-posta adresiniz,
              seçtiğiniz ürün ve adet.
            </li>
            <li>
              <strong>Stok bildirimi formu:</strong> adınız, e-posta adresiniz ve haber almak
              istediğiniz ürün.
            </li>
            <li>
              <strong>Onay kaydı:</strong> açık rıza verdiğiniz, onay verdiğiniz metnin sürümü ve
              onay saati.
            </li>
            <li>
              <strong>Teknik veri:</strong> formu gönderdiğiniz cihazın IP adresi.
            </li>
          </ul>
          <p>
            Sitemiz çerez ya da tarayıcı depolaması kullanmaz; ziyaretinizi izleyen bir analiz aracı
            yoktur.
          </p>

          <h2>3. Verilerinizi hangi amaçlarla ve hangi hukuki sebeplerle işliyoruz?</h2>
          <ul>
            <li>
              Siparişinizi almak, sizinle iletişime geçmek ve ürünü teslim etmek: bir sözleşmenin
              kurulması ve ifası için gerekli olması (KVKK m.5/2-c).
            </li>
            <li>
              Stok bildirimi talebinizi karşılamak: talebiniz üzerine sözleşme öncesi bir adımın
              yerine getirilmesi (KVKK m.5/2-c).
            </li>
            <li>
              Fatura düzenlemek ve yasal kayıtları tutmak: hukuki yükümlülüğümüzü yerine getirmek
              (KVKK m.5/2-ç).
            </li>
            <li>
              Formların kötüye kullanılmasını önlemek (aynı IP adresinden kısa sürede gelen
              istekleri sınırlamak): meşru menfaatimiz (KVKK m.5/2-f).
            </li>
            <li>
              Verilerinizin yurt dışındaki hizmet sağlayıcılara aktarılması: açık rızanız (KVKK
              m.9). {fill('Hizmet sağlayıcılarla Kurul’a bildirilmiş standart sözleşme imzalandıysa burada belirtin')}
            </li>
          </ul>

          <h2>4. Verilerinizi nasıl topluyoruz?</h2>
          <p>
            Ad, telefon ve e-posta bilgilerinizi web sitemizdeki formları doldurduğunuzda doğrudan
            sizden; IP adresinizi ise formu gönderdiğinizde otomatik olarak topluyoruz.
          </p>

          <h2>5. Verileriniz nerede saklanıyor, kimlere aktarılıyor?</h2>
          <p>
            Verileriniz aşağıdaki hizmet sağlayıcıların sunucularından geçer ya da orada saklanır.
            Bunların bir kısmı yurt dışındadır.
          </p>
          <ul>
            <li>
              <strong>Vercel Inc. (ABD):</strong> web sitesinin barındırılması ve form verilerinin
              işlendiği sunucular. Vercel, barındırma hizmeti kapsamında IP adresi içeren erişim
              kayıtları tutabilir.
            </li>
            <li>
              <strong>Upstash ({fill('veritabanı bölgesi, ör. ABD / AB')}):</strong> yalnızca IP
              adresinin, istek sınırı için geçici olarak tutulduğu sayaç.
            </li>
            <li>
              <strong>{fill('webhook / otomasyon servisinin adı ve ülkesi')}:</strong> sipariş ve
              stok bildirimi kayıtlarının iletildiği ve saklandığı servis.
            </li>
            <li>
              <strong>Yurt içi:</strong> {fill('kargo firması')} (teslimat için gereken bilgiler),{' '}
              {fill('mali müşavir / muhasebe')} (fatura için).
            </li>
          </ul>
          <p>Verilerinizi bunların dışında kimseyle paylaşmıyor ve satmıyoruz.</p>

          <h2>6. Verilerinizi ne kadar süre saklıyoruz?</h2>
          <ul>
            <li>Sipariş kayıtları: {fill('süre, ör. ilgili vergi ve ticaret mevzuatındaki saklama süreleri')}.</li>
            <li>
              Stok bildirimi talepleri: {fill('ör. ürün stoka girip size haber verilene kadar, en fazla … ay')}.
            </li>
            <li>Onay kayıtları: {fill('süre, ör. ilgili sipariş kaydıyla aynı süre')}.</li>
            <li>Upstash’teki IP sayacı: yaklaşık 2 dakika sonra kendiliğinden silinir.</li>
            <li>Vercel erişim kayıtları: {fill('Vercel planınıza göre saklama süresi')}.</li>
          </ul>
          <p>
            Süre dolduğunda verileriniz silinir, yok edilir ya da anonim hâle getirilir.
          </p>

          <h2>7. KVKK’ya göre haklarınız</h2>
          <p>KVKK’nın 11. maddesi uyarınca bize başvurarak şunları talep edebilirsiniz:</p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
            <li>İşlenmişse buna ilişkin bilgi isteme,</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li>
            <li>KVKK’nın 7. maddesindeki şartlar çerçevesinde silinmesini veya yok edilmesini isteme,</li>
            <li>
              Düzeltme, silme veya yok etme işlemlerinin, verilerin aktarıldığı üçüncü kişilere
              bildirilmesini isteme,
            </li>
            <li>
              Verilerin yalnızca otomatik sistemlerle analiz edilmesi sonucunda aleyhinize bir sonuç
              çıkmasına itiraz etme,
            </li>
            <li>Kanuna aykırı işleme nedeniyle zarara uğradıysanız zararın giderilmesini isteme.</li>
          </ul>
          <p>
            Yurt dışına aktarım için verdiğiniz açık rızayı dilediğiniz zaman geri alabilirsiniz.
            Geri alma, o tarihe kadar yapılan işlemleri etkilemez. Formlarımız bu aktarım olmadan
            çalışamadığı için, rızanızı geri aldıktan sonra sipariş ve taleplerinizi{' '}
            {fill('telefon / e-posta gibi alternatif bir kanal')} üzerinden iletebilirsiniz.
          </p>

          <h2>8. Nasıl başvurabilirsiniz?</h2>
          <p>
            Taleplerinizi {fill('başvuru e-postası')} adresine e-posta göndererek ya da{' '}
            {fill('posta adresi')} adresine yazılı olarak iletebilirsiniz. Başvurunuzu en kısa
            sürede ve en geç 30 gün içinde ücretsiz olarak sonuçlandırırız (KVKK m.13); işlem ayrıca
            bir maliyet gerektirirse Kurul’un belirlediği tarifedeki ücret alınabilir.
          </p>
          <p>
            Başvurunuz reddedilirse, yanıtımızı yetersiz bulursanız ya da süresinde yanıt
            alamazsanız, yanıtı öğrendiğiniz tarihten itibaren 30 gün ve her hâlde başvuru
            tarihinden itibaren 60 gün içinde Kişisel Verileri Koruma Kurulu’na şikâyette
            bulunabilirsiniz (KVKK m.14).
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu metni gerektiğinde güncelleyebiliriz. Güncel sürüm her zaman bu sayfada yer alır;
            sayfanın başındaki tarih son güncellemeyi gösterir. Formlarda verdiğiniz onay, o tarihte
            geçerli olan sürüm için kaydedilir.
          </p>
        </article>
      </main>

      <footer>
        &copy; 2026 Lumie Mum Atölyesi · El yapımı, sevgiyle.
      </footer>
    </>
  )
}
