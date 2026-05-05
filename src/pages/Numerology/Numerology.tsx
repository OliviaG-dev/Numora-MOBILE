import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { NumerologySummary } from "../../components/NumerologySummary/NumerologySummary";
import type { NumerologyResult } from "../../types/numerology.types";

type NumerologyProps = {
  loading: boolean;
  error: string | null;
  result: NumerologyResult | null;
  onCalculate: (payload: {
    fullName: string;
    birthDate: string;
    referenceDate?: string;
    address?: { streetNumber: string; streetName: string; allowMasterNumbers?: boolean };
    locality?: { postalCode: string; city: string; allowMasterNumbers?: boolean };
  }) => Promise<void>;
};

export function Numerology({ loading, error, result, onCalculate }: NumerologyProps) {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [referenceDate, setReferenceDate] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const handleSubmit = async () => {
    await onCalculate({
      fullName: fullName.trim(),
      birthDate: birthDate.trim(),
      referenceDate: referenceDate.trim() || undefined,
      address:
        streetNumber.trim() && streetName.trim()
          ? { streetNumber: streetNumber.trim(), streetName: streetName.trim() }
          : undefined,
      locality:
        postalCode.trim() && city.trim()
          ? { postalCode: postalCode.trim(), city: city.trim() }
          : undefined
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Numerology calculator</Text>
        <TextInput
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          placeholder="Birth date (YYYY-MM-DD)"
          value={birthDate}
          onChangeText={setBirthDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Reference date (optional)"
          value={referenceDate}
          onChangeText={setReferenceDate}
          style={styles.input}
        />
        <Text style={styles.section}>Address (optional)</Text>
        <TextInput
          placeholder="Street number"
          value={streetNumber}
          onChangeText={setStreetNumber}
          style={styles.input}
        />
        <TextInput
          placeholder="Street name"
          value={streetName}
          onChangeText={setStreetName}
          style={styles.input}
        />
        <Text style={styles.section}>Locality (optional)</Text>
        <TextInput
          placeholder="Postal code"
          value={postalCode}
          onChangeText={setPostalCode}
          style={styles.input}
        />
        <TextInput placeholder="City" value={city} onChangeText={setCity} style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={() => void handleSubmit()}
        >
          <Text style={styles.buttonText}>{loading ? "Calculating..." : "Calculate"}</Text>
        </Pressable>
        {result ? <NumerologySummary result={result} /> : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  container: {
    padding: 16,
    gap: 10,
    paddingBottom: 40
  },
  title: {
    fontSize: 24,
    fontWeight: "800"
  },
  section: {
    marginTop: 8,
    fontWeight: "700",
    color: "#4d4d4d"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  },
  button: {
    marginTop: 4,
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  }
});
