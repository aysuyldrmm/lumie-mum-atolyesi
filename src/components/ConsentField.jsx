import { PRIVACY_POLICY_PATH } from '../data/privacy.js'

// KVKK: aydınlatma ayrı bir satırda verilir; kutucuk yalnızca yurt dışına
// aktarım için açık rızadır ve varsayılan olarak boştur.
export default function ConsentField({ checked, onChange, error }) {
  const policyLink = (text) => (
    <a href={PRIVACY_POLICY_PATH} target="_blank" rel="noopener">
      {text}
    </a>
  )

  return (
    <div className="form-onay-alani">
      <p className="form-aydinlatma">
        Kişisel verileriniz {policyLink('Gizlilik Politikası ve Aydınlatma Metni')}’nde
        açıklandığı şekilde işlenir.
      </p>
      <label className="form-onay">
        <input type="checkbox" name="consent" checked={checked} onChange={onChange} />
        <span>
          Kişisel verilerimin, {policyLink('Gizlilik Politikası')}’nda belirtilen yurt dışındaki
          hizmet sağlayıcılara aktarılmasına açık rıza veriyorum.
        </span>
      </label>
      {error && <span className="alan-hatasi">{error}</span>}
    </div>
  )
}
