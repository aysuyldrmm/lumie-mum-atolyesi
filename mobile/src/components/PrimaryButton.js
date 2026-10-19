import { Pressable, StyleSheet, Text } from 'react-native'
import { colors, serif } from '../theme.js'

// Dolu, bal rengi düğme (webdeki `.dugme--dolu`).
export default function PrimaryButton({ label, onPress, disabled = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      aria-disabled={disabled}
      style={({ pressed }) => [styles.button, (pressed || disabled) && styles.buttonPressed]}
    >
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 13,
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: colors.balKoyu,
  },
  buttonPressed: {
    backgroundColor: colors.kahve,
  },
  text: {
    fontFamily: serif,
    fontSize: 16,
    color: colors.krem,
  },
})
