import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";

type CompatibilityKind = "love" | "friendship" | "work";

type CompatibilityResult = {
  score: number;
  tone: "harmonious" | "balanced" | "growth";
  summary: string;
  strengths: string[];
  challenges: string[];
};

const RELATIONSHIP_LABELS: Record<CompatibilityKind, string> = {
  love: "Love",
  friendship: "Friendship",
  work: "Work"
};

export function CompatibilityAnalyzer() {
  const [relationshipType, setRelationshipType] = useState<CompatibilityKind>("love");
  const [person1Name, setPerson1Name] = useState("");
  const [person1BirthDate, setPerson1BirthDate] = useState("");
  const [person2Name, setPerson2Name] = useState("");
  const [person2BirthDate, setPerson2BirthDate] = useState("");
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const analyze = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const [p1, p2] = await Promise.all([
        calculateNumerology({
          fullName: person1Name.trim(),
          birthDate: person1BirthDate.trim()
        }),
        calculateNumerology({
          fullName: person2Name.trim(),
          birthDate: person2BirthDate.trim()
        })
      ]);

      const p1LifePath = Number(p1.result.core.lifePath);
      const p2LifePath = Number(p2.result.core.lifePath);
      const p1Expression = Number(p1.result.core.expression);
      const p2Expression = Number(p2.result.core.expression);

      const baseDiff = Math.abs(p1LifePath - p2LifePath);
      const expressionDiff = Math.abs(p1Expression - p2Expression);
      const relationBonus = relationshipType === "love" ? 4 : relationshipType === "friendship" ? 2 : 0;
      const computedScore = Math.max(35, Math.min(98, 90 - baseDiff * 6 - expressionDiff * 2 + relationBonus));

      const tone: CompatibilityResult["tone"] =
        computedScore >= 82 ? "harmonious" : computedScore >= 65 ? "balanced" : "growth";

      const summary =
        tone === "harmonious"
          ? "Strong numerology resonance between both profiles."
          : tone === "balanced"
            ? "Good compatibility with complementary dynamics."
            : "Contrastive profiles: alignment needs intentional effort.";

      setResult({
        score: computedScore,
        tone,
        summary,
        strengths: [
          `Life paths: ${p1LifePath} and ${p2LifePath}`,
          `Expression numbers: ${p1Expression} and ${p2Expression}`
        ],
        challenges: [
          "Keep shared goals explicit.",
          "Review decisions when emotions or pressure increase."
        ]
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to analyze compatibility"));
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled =
    isLoading ||
    !person1Name.trim() ||
    !person1BirthDate.trim() ||
    !person2Name.trim() ||
    !person2BirthDate.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Compatibility Analyzer</Text>

        <View style={styles.relationshipRow}>
          {(Object.keys(RELATIONSHIP_LABELS) as CompatibilityKind[]).map((kind) => (
            <Pressable
              key={kind}
              onPress={() => setRelationshipType(kind)}
              style={[styles.relationshipButton, relationshipType === kind && styles.relationshipButtonActive]}
            >
              <Text
                style={[
                  styles.relationshipButtonText,
                  relationshipType === kind && styles.relationshipButtonTextActive
                ]}
              >
                {RELATIONSHIP_LABELS[kind]}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Person 1</Text>
          <TextInput
            value={person1Name}
            onChangeText={setPerson1Name}
            placeholder="Full name"
            style={styles.input}
          />
          <TextInput
            value={person1BirthDate}
            onChangeText={setPerson1BirthDate}
            placeholder="Birth date (YYYY-MM-DD)"
            style={styles.input}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Person 2</Text>
          <TextInput
            value={person2Name}
            onChangeText={setPerson2Name}
            placeholder="Full name"
            style={styles.input}
          />
          <TextInput
            value={person2BirthDate}
            onChangeText={setPerson2BirthDate}
            placeholder="Birth date (YYYY-MM-DD)"
            style={styles.input}
          />
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable onPress={() => void analyze()} disabled={isDisabled} style={[styles.button, isDisabled && styles.buttonDisabled]}>
          <Text style={styles.buttonText}>{isLoading ? "Analyzing..." : "Analyze compatibility"}</Text>
        </Pressable>

        {result ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Result ({RELATIONSHIP_LABELS[relationshipType]})</Text>
            <Text style={styles.score}>{result.score}%</Text>
            <Text style={styles.line}>Tone: {result.tone}</Text>
            <Text style={styles.line}>{result.summary}</Text>
            <Text style={styles.sectionTitle}>Strengths</Text>
            {result.strengths.map((item) => (
              <Text key={item} style={styles.line}>- {item}</Text>
            ))}
            <Text style={styles.sectionTitle}>Challenges</Text>
            {result.challenges.map((item) => (
              <Text key={item} style={styles.line}>- {item}</Text>
            ))}
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
  relationshipRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  relationshipButton: {
    borderWidth: 1,
    borderColor: "#c5c5c5",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff"
  },
  relationshipButtonActive: {
    borderColor: "#1f6feb",
    backgroundColor: "#eaf2ff"
  },
  relationshipButtonText: { color: "#3a3a3a", fontWeight: "600" },
  relationshipButtonTextActive: { color: "#1f6feb", fontWeight: "700" },
  card: { backgroundColor: "#ffffff", borderRadius: 12, padding: 14, gap: 8 },
  cardTitle: { fontSize: 17, fontWeight: "700" },
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
  score: { fontSize: 28, fontWeight: "800", color: "#1f6feb" },
  sectionTitle: { marginTop: 8, fontWeight: "700", color: "#222222" },
  line: { color: "#222222" }
});
