import { StyleSheet, View } from "react-native";

import { colors } from "../../styles/theme";

/**
 * Fond cosmique simplifié (équivalent RN de NumerologyBackground web).
 */
export function NumerologyBackground() {
  return (
    <View style={styles.root} pointerEvents="none">
      <View style={styles.gradientBase} />
      <View style={styles.glowPurple} />
      <View style={styles.glowGold} />
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0
  },
  gradientBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgSecondary
  },
  glowPurple: {
    position: "absolute",
    top: "15%",
    left: "10%",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(107, 70, 193, 0.35)"
  },
  glowGold: {
    position: "absolute",
    bottom: "20%",
    right: "5%",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(245, 158, 11, 0.2)"
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)"
  }
});
