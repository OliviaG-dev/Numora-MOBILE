import { StyleSheet, Text, View } from "react-native";

import type { NumerologyResult } from "../../types/numerology.types";

type NumerologySummaryProps = {
  result: NumerologyResult;
};

export function NumerologySummary({ result }: NumerologySummaryProps) {
  const core = result.core;

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Result for {result.identity.fullName}</Text>
      <Text style={styles.line}>Life path: {String(core.lifePath ?? "-")}</Text>
      <Text style={styles.line}>Expression: {String(core.expression ?? "-")}</Text>
      <Text style={styles.line}>Soul urge: {String(core.soulUrge ?? "-")}</Text>
      <Text style={styles.line}>Personality: {String(core.personality ?? "-")}</Text>
      <Text style={styles.line}>Birthday: {String(core.birthday ?? "-")}</Text>
      <Text style={styles.line}>Heart: {String(core.heart ?? "-")}</Text>
      <Text style={styles.line}>Realisation: {String(core.realisation ?? "-")}</Text>
      <Text style={styles.hint}>Open Matrix Destiny or Tree of Life for extended results.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    gap: 4
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8
  },
  line: {
    color: "#202020"
  },
  hint: {
    marginTop: 10,
    fontSize: 13,
    color: "#5f5f5f"
  }
});
