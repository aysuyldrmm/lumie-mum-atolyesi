import { Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { PRIVACY_POLICY_PATH } from '../../../src/data/privacy.js'
import { API_URL } from '../config.js'
import { colors, serif } from '../theme.js'

const openPolicy = () => Linking.openURL(`${API_URL}${PRIVACY_POLICY_PATH}`)

// KVKK: aydınlatma ayrı bir satırda verilir; kutucuk yalnızca yurt dışına
// aktarım için açık rızadır ve varsayılan olarak boştur. Metinler web sitesindekiyle aynıdır.
export default function ConsentField({ checked, onChange, error }) {
  const link = (text) => (
    <Text style={styles.link} onPress={openPolicy} accessibilityRole="link">
      {text}
    </Text>
  )

  return (
    <View style={styles.box}>
      <Text style={styles.notice}>
        Kişisel verileriniz {link('Gizlilik Politikası ve Aydınlatma Metni')}’nde açıklandığı
        şekilde işlenir.
      </Text>
      <Pressable
        style={styles.row}
        onPress={() => onChange(!checked)}
        accessibilityRole="checkbox"
        aria-checked={checked}
        hitSlop={6}
      >
        <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
          {checked && <Text style={styles.tick}>✓</Text>}
        </View>
        <Text style={styles.label}>
          Kişisel verilerimin, {link('Gizlilik Politikası')}’nda belirtilen yurt dışındaki hizmet
          sağlayıcılara aktarılmasına açık rıza veriyorum.
        </Text>
      </Pressable>
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    gap: 8,
    marginBottom: 16,
  },
  notice: {
    fontFamily: serif,
    fontSize: 13,
    lineHeight: 19,
    color: colors.kahveAcik,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.balKoyu,
    borderRadius: 4,
    backgroundColor: colors.krem,
  },
  checkboxChecked: {
    backgroundColor: colors.balKoyu,
  },
  tick: {
    color: colors.krem,
    fontSize: 15,
    lineHeight: 18,
    fontWeight: 'bold',
  },
  label: {
    flex: 1,
    fontFamily: serif,
    fontSize: 13,
    lineHeight: 19,
    color: colors.kahve,
  },
  link: {
    color: colors.balKoyu,
    textDecorationLine: 'underline',
  },
  error: {
    fontFamily: serif,
    fontSize: 13,
    color: colors.balKoyu,
  },
})
