import { StyleSheet, TextInput, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

import { EU_DATE_PLACEHOLDER, formatEuropeanDateInput } from "../../utils/europeanDate";

type EuropeanDateInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function EuropeanDateInput({
  value,
  onChangeText,
  placeholder = EU_DATE_PLACEHOLDER,
  style,
  inputStyle
}: EuropeanDateInputProps) {
  return (
    <TextInput
      style={[styles.input, style, inputStyle]}
      value={value}
      onChangeText={(text) => onChangeText(formatEuropeanDateInput(text))}
      placeholder={placeholder}
      keyboardType="numbers-and-punctuation"
      maxLength={10}
      autoComplete="off"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  }
});
