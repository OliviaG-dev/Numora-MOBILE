import { useEffect, useMemo, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import { formatIsoToEuropean, getTodayIso } from "../../utils/europeanDate";
import type { NumerologyResult } from "../../types/numerology.types";

export function DailyVibration() {
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const todayIso = useMemo(() => getTodayIso(), []);
  const todayEuropean = useMemo(() => formatIsoToEuropean(todayIso), [todayIso]);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await calculateNumerology({
          fullName: "Daily Vibration",
          birthDate: todayIso,
          referenceDate: todayIso
        });
        setResult(response.result);
      } catch (requestError) {
        setError(getApiErrorMessage(requestError, "Unable to load daily vibration"));
      } finally {
        setIsLoading(false);
      }
    })();
  }, [todayIso]);

  const universal =
    (result?.universalVibrations as Record<string, unknown> | undefined) ?? undefined;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Daily Vibration</Text>
        <Text style={styles.subtitle}>{todayEuropean}</Text>
        {isLoading ? <Text>Loading...</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {result ? (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Universal vibrations</Text>
              <Text style={styles.line}>Day: {String(universal?.day ?? "-")}</Text>
              <Text style={styles.line}>Month: {String(universal?.month ?? "-")}</Text>
              <Text style={styles.line}>Year: {String(universal?.year ?? "-")}</Text>
              <Text style={styles.line}>Global: {String(universal?.universal ?? "-")}</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal vibrations</Text>
              <Text style={styles.line}>Personal day: {String(result.personal.personalDay ?? "-")}</Text>
              <Text style={styles.line}>
                Personal month: {String(result.personal.personalMonth ?? "-")}
              </Text>
              <Text style={styles.line}>Personal year: {String(result.personal.personalYear ?? "-")}</Text>
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  container: { padding: 16, gap: 10, paddingBottom: 32 },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#646464", marginBottom: 8 },
  card: { backgroundColor: "#ffffff", borderRadius: 12, padding: 14, gap: 6 },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  line: { color: "#222222" },
  error: { color: "#d1242f", fontWeight: "600" }
});
