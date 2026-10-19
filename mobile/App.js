import { StatusBar } from 'expo-status-bar'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { PRIVACY_POLICY_PATH } from '../src/data/privacy.js'
import ProductList from './src/components/ProductList.js'
import { API_URL } from './src/config.js'
import { colors, serif } from './src/theme.js'

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.screen} edges={['top', 'left', 'right']}>
        <StatusBar style="dark" />
        <ProductList
          header={
            <View style={styles.header}>
              <Text style={styles.title} accessibilityRole="header">
                Lumie <Text style={styles.titleAccent}>Mum Atölyesi</Text>
              </Text>
              <Text style={styles.slogan}>El yapımı, kalbe dokunan sıcak ışıklar.</Text>
            </View>
          }
          footer={
            <SafeAreaView style={styles.footer} edges={['bottom']}>
              <Text style={styles.footerText}>© 2026 Lumie Mum Atölyesi · El yapımı, sevgiyle.</Text>
              <Text
                style={styles.footerLink}
                accessibilityRole="link"
                onPress={() => Linking.openURL(`${API_URL}${PRIVACY_POLICY_PATH}`)}
              >
                Gizlilik Politikası
              </Text>
            </SafeAreaView>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.krem,
  },
  header: {
    alignItems: 'center',
    paddingTop: 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    backgroundColor: colors.kremKoyu,
    borderBottomWidth: 1,
    // Kenarlık rengi: balKoyu (#b27624), yarı saydam
    borderBottomColor: 'rgba(178, 118, 36, 0.18)',
  },
  title: {
    fontFamily: serif,
    fontSize: 32,
    letterSpacing: 1,
    textAlign: 'center',
    color: colors.kahve,
  },
  titleAccent: {
    fontStyle: 'italic',
    color: colors.balKoyu,
  },
  slogan: {
    marginTop: 10,
    fontFamily: serif,
    fontStyle: 'italic',
    fontSize: 16,
    textAlign: 'center',
    color: colors.kahveAcik,
  },
  footer: {
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
    paddingTop: 22,
    paddingHorizontal: 16,
    paddingBottom: 22,
    backgroundColor: colors.kremKoyu,
  },
  footerText: {
    fontFamily: serif,
    fontSize: 13,
    textAlign: 'center',
    color: colors.kahveAcik,
  },
  footerLink: {
    fontFamily: serif,
    fontSize: 13,
    color: colors.balKoyu,
    textDecorationLine: 'underline',
  },
})
