import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { EuropeanDateInput } from "../../components/EuropeanDateInput/EuropeanDateInput";
import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import { EU_DATE_FORMAT_LABEL, parseDateInputToIso } from "../../utils/europeanDate";
import type { NumerologyResult } from "../../types/numerology.types";

export function DateAnalyzer() {
  const [birthDate, setBirthDate] = useState("");
  const [referenceDate, setReferenceDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyzeDate = async () => {
    setError(null);
    const dateIso = parseDateInputToIso(birthDate);
    if (!dateIso) {
      setError(`Date invalide. Utilise le format ${EU_DATE_FORMAT_LABEL}.`);
      return;
    }
    const referenceIso = referenceDate.trim() ? parseDateInputToIso(referenceDate) : null;
    if (referenceDate.trim() && !referenceIso) {
      setError(`Date de référence invalide (${EU_DATE_FORMAT_LABEL}).`);
      return;
    }
    setIsLoading(true);
    try {
      const response = await calculateNumerology({
        fullName: "Date Analyzer",
        birthDate: dateIso,
        referenceDate: referenceIso ?? undefined
      });
      setResult(response.result);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to analyze date"));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Date Analyzer</Text>
        <EuropeanDateInput value={birthDate} onChangeText={setBirthDate} inputStyle={styles.input} />
        <EuropeanDateInput
          value={referenceDate}
          onChangeText={setReferenceDate}
          placeholder={`Référence (${EU_DATE_FORMAT_LABEL})`}
          inputStyle={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          onPress={() => void analyzeDate()}
          disabled={isLoading || !birthDate.trim()}
          style={[styles.button, (isLoading || !birthDate.trim()) && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{isLoading ? "Analyzing..." : "Analyze date"}</Text>
        </Pressable>

        {result ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Date vibration summary</Text>
            <Text style={styles.line}>Life path: {String(result.core.lifePath ?? "-")}</Text>
            <Text style={styles.line}>Personal year: {String(result.personal.personalYear ?? "-")}</Text>
            <Text style={styles.line}>Personal month: {String(result.personal.personalMonth ?? "-")}</Text>
            <Text style={styles.line}>Personal day: {String(result.personal.personalDay ?? "-")}</Text>
            <Text style={styles.line}>
              Universal year: {String((result.universalVibrations as Record<string, unknown>)?.year ?? "-")}
            </Text>
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
