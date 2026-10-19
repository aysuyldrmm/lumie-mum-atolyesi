import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { colors, serif } from '../theme.js'

// Formların açıldığı pencere. Klavye açılınca alanlar görünür kalsın diye
// içerik kaydırılabilir ve klavyeye göre yukarı itilir.
export default function FormModal({ title, onClose, children }) {
  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Kapat" />
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Kapat" hitSlop={10}>
              <Text style={styles.close}>×</Text>
            </Pressable>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    // Arka plan rengi: kahve (#4a3424), yarı saydam
    backgroundColor: 'rgba(74, 52, 36, 0.45)',
  },
  sheet: {
    maxHeight: '90%',
    width: '100%',
    maxWidth: 440,
    alignSelf: 'center',
    backgroundColor: colors.krem,
    borderWidth: 1,
    borderColor: colors.kremKoyu,
    borderRadius: 14,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 8,
  },
  title: {
    fontFamily: serif,
    fontSize: 21,
    color: colors.kahve,
  },
  close: {
    fontSize: 28,
    lineHeight: 30,
    color: colors.kahveAcik,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 22,
  },
})
