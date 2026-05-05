import { useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from "react-native";

import type { CreateReadingPayload, ReadingCategory } from "../../types/reading.types";

type NewReadingProps = {
  onSubmit: (payload: CreateReadingPayload) => Promise<void>;
  onBack: () => void;
};

export function NewReading({ onSubmit, onBack }: NewReadingProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [category, setCategory] = useState<ReadingCategory>("custom");
  const [results, setResults] = useState("{}");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      const parsedResults = JSON.parse(results) as Record<string, unknown>;
      await onSubmit({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        birthDate: birthDate.trim(),
        category,
        results: parsedResults
      });
      onBack();
    } catch {
      setError("Invalid form or results JSON");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Create reading</Text>
        <TextInput
          placeholder="First name"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />
        <TextInput
          placeholder="Last name"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />
        <TextInput
          placeholder="Birth date (YYYY-MM-DD)"
          value={birthDate}
          onChangeText={setBirthDate}
          style={styles.input}
        />
        <TextInput
          placeholder="Category (life-path|compatibility|forecast|custom)"
          value={category}
          onChangeText={(value) => setCategory(value as ReadingCategory)}
          style={styles.input}
        />
        <TextInput
          placeholder='Results JSON (ex: {"score": 9})'
          value={results}
          onChangeText={setResults}
          style={[styles.input, styles.multiline]}
          multiline
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} disabled={submitting} onPress={() => void handleSubmit()}>
            <Text style={styles.primaryText}>{submitting ? "Saving..." : "Save"}</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={onBack}>
            <Text style={styles.secondaryText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  container: {
    flex: 1,
    padding: 16,
    gap: 10
  },
  title: {
    fontSize: 24,
    fontWeight: "800"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  },
  multiline: {
    minHeight: 80,
    textAlignVertical: "top"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  primaryButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  primaryText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  secondaryText: {
    color: "#222222",
    fontWeight: "700"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  }
});
