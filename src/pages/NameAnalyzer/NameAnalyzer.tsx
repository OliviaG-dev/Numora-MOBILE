import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import type { NumerologyResult } from "../../types/numerology.types";

export function NameAnalyzer() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeName = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await calculateNumerology({
        fullName: fullName.trim(),
        birthDate: birthDate.trim()
      });
      setResult(response.result);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to analyze name"));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Name Analyzer</Text>
        <TextInput
          value={fullName}
          onChangeText={setFullName}
          placeholder="Full name / project name"
          style={styles.input}
        />
        <TextInput
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="Reference birth date (YYYY-MM-DD)"
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          onPress={() => void analyzeName()}
          disabled={isLoading || !fullName.trim() || !birthDate.trim()}
          style={[
            styles.button,
            (isLoading || !fullName.trim() || !birthDate.trim()) && styles.buttonDisabled
          ]}
        >
          <Text style={styles.buttonText}>{isLoading ? "Analyzing..." : "Analyze name"}</Text>
        </Pressable>

        {result ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Name vibration summary</Text>
            <Text style={styles.line}>Expression: {String(result.core.expression ?? "-")}</Text>
            <Text style={styles.line}>Soul urge: {String(result.core.soulUrge ?? "-")}</Text>
            <Text style={styles.line}>Personality: {String(result.core.personality ?? "-")}</Text>
            <Text style={styles.line}>Heart: {String(result.core.heart ?? "-")}</Text>
            <Text style={styles.line}>Realisation: {String(result.core.realisation ?? "-")}</Text>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  container: { padding: 16, gap: 10, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: "800" },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  },
  button: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center"
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#ffffff", fontWeight: "700" },
  error: { color: "#d1242f", fontWeight: "600" },
  card: { backgroundColor: "#ffffff", borderRadius: 12, padding: 14, gap: 6 },
  cardTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  line: { color: "#222222" }
});
