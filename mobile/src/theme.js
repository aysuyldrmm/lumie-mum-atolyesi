import { Platform } from 'react-native'

// Web sitesindeki renk paletinin (src/index.css) aynısı. React Native CSS
// değişkenlerini okuyamadığı için burada tekrar yazılır; bir renk değişirse
// iki yerde birlikte güncellenir.
export const colors = {
  krem: '#fbf5ea',
  kremKoyu: '#f3e6cf',
  bal: '#d99a3d',
  balKoyu: '#b27624',
  kahve: '#4a3424',
  kahveAcik: '#7a5f4a',
}

// Web sitesindeki Georgia yazı tipine en yakın sistem yazı tipi.
export const serif = Platform.select({
  ios: 'Georgia',
  android: 'serif',
  default: 'Georgia, "Times New Roman", serif',
})
