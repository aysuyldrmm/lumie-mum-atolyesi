import { StyleSheet, Text, View } from 'react-native'
import { colors, serif } from '../theme.js'
import PrimaryButton from './PrimaryButton.js'

export default function SuccessMessage({ message, onDone }) {
  return (
    <View style={styles.box}>
      <Text style={styles.text}>{message}</Text>
      <PrimaryButton label="Kapat" onPress={onDone} />
    </View>
  )
}

const styles = StyleSheet.create({
  box: {
    gap: 20,
  },
  text: {
    fontFamily: serif,
    fontSize: 16,
    lineHeight: 23,
    color: colors.kahve,
  },
})
