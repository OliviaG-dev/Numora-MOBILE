import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import type { NumerologyResult } from "../../types/numerology.types";

export function PlaceVibration() {
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await calculateNumerology({
        fullName: "Place Vibration",
        birthDate: birthDate.trim() || "1990-01-01",
        address:
          streetNumber.trim() && streetName.trim()
            ? { streetNumber: streetNumber.trim(), streetName: streetName.trim() }
            : undefined,
        locality:
          postalCode.trim() && city.trim()
            ? { postalCode: postalCode.trim(), city: city.trim() }
            : undefined
      });
      setResult(response.result);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to analyze place vibration"));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const place = result?.place;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Place Vibration</Text>
        <TextInput
          value={streetNumber}
          onChangeText={setStreetNumber}
          placeholder="Street number"
          style={styles.input}
        />
        <TextInput
          value={streetName}
          onChangeText={setStreetName}
          placeholder="Street name"
          style={styles.input}
        />
        <TextInput
          value={postalCode}
          onChangeText={setPostalCode}
          placeholder="Postal code"
          style={styles.input}
        />
        <TextInput value={city} onChangeText={setCity} placeholder="City" style={styles.input} />
        <TextInput
          value={birthDate}
          onChangeText={setBirthDate}
          placeholder="Birth date for compatibility (optional)"
          style={styles.input}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          onPress={() => void analyze()}
          disabled={isLoading}
          style={[styles.button, isLoading && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{isLoading ? "Analyzing..." : "Analyze place"}</Text>
        </Pressable>
        {result ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Place summary</Text>
            <Text style={styles.line}>
              Address vibration: {String(place?.addressVibration ?? "not provided")}
            </Text>
            <Text style={styles.line}>
              Locality vibration: {String(place?.localityVibration ?? "not provided")}
            </Text>
            <Text style={styles.line}>Life path: {String(result.core.lifePath ?? "-")}</Text>
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
  card: { backgroundColor: "#ffffff", borderRadius: 12, padding: 14, gap: 6 },
  cardTitle: { fontSize: 17, fontWeight: "700" },
  line: { color: "#222222" },
  error: { color: "#d1242f", fontWeight: "600" }
});
