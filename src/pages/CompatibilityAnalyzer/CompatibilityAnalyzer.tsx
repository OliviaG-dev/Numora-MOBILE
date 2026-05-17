import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { EuropeanDateInput } from "../../components/EuropeanDateInput/EuropeanDateInput";
import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import { EU_DATE_FORMAT_LABEL, parseDateInputToIso } from "../../utils/europeanDate";

type CompatibilityKind = "love" | "friendship" | "work";

type CompatibilityResult = {
  score: number;
  tone: "harmonious" | "balanced" | "growth";
  summary: string;
  breakdown: {
    lifePath: number;
    expression: number;
    emotional: number;
  };
  pair: {
    lifePath: [number, number];
    expression: [number, number];
  };
  strengths: string[];
  challenges: string[];
  recommendations: string[];
  relationshipInsights: Array<{
    title: string;
    lines: string[];
  }>;
};

const RELATIONSHIP_LABELS: Record<CompatibilityKind, string> = {
  love: "Love",
  friendship: "Friendship",
  work: "Work"
};

const RELATIONSHIP_HINTS: Record<
  CompatibilityKind,
  {
    strengths: string[];
    challenges: string[];
    recommendations: string[];
    insights: Array<{ title: string; lines: string[] }>;
  }
> = {
  love: {
    strengths: [
      "Mutual attraction is easier when values are explicit.",
      "Emotional resonance supports long-term commitment."
    ],
    challenges: [
      "Idealization can hide practical incompatibilities.",
      "Strong chemistry can create avoidable emotional loops."
    ],
    recommendations: [
      "Create a weekly check-in ritual focused on needs and gratitude.",
      "Define shared boundaries before major decisions."
    ],
    insights: [
      {
        title: "Heart dynamic",
        lines: [
          "Your love compatibility reflects emotional rhythm and attachment style.",
          "Shared rituals stabilize the relationship during stressful phases."
        ]
      }
    ]
  },
  friendship: {
    strengths: [
      "Friendship thrives through complementary social energy.",
      "Different perspectives can increase trust and maturity."
    ],
    challenges: [
      "Communication mismatch may create silent misunderstandings.",
      "Uneven emotional availability can frustrate both sides."
    ],
    recommendations: [
      "Set clear expectations around availability and support.",
      "Use shared activities to reinforce connection over time."
    ],
    insights: [
      {
        title: "Friendship vibe",
        lines: [
          "Your friendship score reflects trust, joy and depth of connection.",
          "Consistency is usually more important than intensity."
        ]
      }
    ]
  },
  work: {
    strengths: [
      "Differentiated skills can increase execution quality.",
      "Numerology contrast often improves strategic thinking."
    ],
    challenges: [
      "Role ambiguity can trigger avoidable friction.",
      "Pressure can amplify leadership style clashes."
    ],
    recommendations: [
      "Assign ownership areas before project kickoff.",
      "Use short feedback loops and decision logs."
    ],
    insights: [
      {
        title: "Work synergy",
        lines: [
          "Professional compatibility combines pace, structure and communication style.",
          "Clear ownership reduces coordination cost."
        ]
      }
    ]
  }
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
    const p1BirthIso = parseDateInputToIso(person1BirthDate);
    const p2BirthIso = parseDateInputToIso(person2BirthDate);
    if (!p1BirthIso || !p2BirthIso) {
      setError(`Dates de naissance invalides (${EU_DATE_FORMAT_LABEL}).`);
      return;
    }
    setIsLoading(true);
    try {
      const [p1, p2] = await Promise.all([
        calculateNumerology({
          fullName: person1Name.trim(),
          birthDate: p1BirthIso
        }),
        calculateNumerology({
          fullName: person2Name.trim(),
          birthDate: p2BirthIso
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
      const lifePathScore = clampScore(100 - baseDiff * 11 + relationBonus);
      const expressionScore = clampScore(100 - expressionDiff * 9 + relationBonus);
      const emotionalScore = clampScore(Math.round((lifePathScore + expressionScore) / 2) - 3 + relationBonus);

      const tone: CompatibilityResult["tone"] =
        computedScore >= 82 ? "harmonious" : computedScore >= 65 ? "balanced" : "growth";

      const summary =
        tone === "harmonious"
          ? "Strong numerology resonance between both profiles."
          : tone === "balanced"
            ? "Good compatibility with complementary dynamics."
            : "Contrastive profiles: alignment needs intentional effort.";

      const relationHints = RELATIONSHIP_HINTS[relationshipType];

      setResult({
        score: computedScore,
        tone,
        summary,
        breakdown: {
          lifePath: lifePathScore,
          expression: expressionScore,
          emotional: emotionalScore
        },
        pair: {
          lifePath: [p1LifePath, p2LifePath],
          expression: [p1Expression, p2Expression]
        },
        strengths: [
          `Life paths ${p1LifePath}/${p2LifePath} create a ${tone} base for this relationship.`,
          `Expression numbers ${p1Expression}/${p2Expression} shape your communication style.`,
          ...relationHints.strengths
        ],
        challenges: [
          `Life path gap of ${baseDiff} can lead to different priorities.`,
          `Expression gap of ${expressionDiff} may require extra communication clarity.`,
          ...relationHints.challenges
        ],
        recommendations: relationHints.recommendations,
        relationshipInsights: relationHints.insights
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
          <EuropeanDateInput
            value={person1BirthDate}
            onChangeText={setPerson1BirthDate}
            inputStyle={styles.input}
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
          <EuropeanDateInput
            value={person2BirthDate}
            onChangeText={setPerson2BirthDate}
            inputStyle={styles.input}
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
            <Text style={styles.sectionTitle}>Numerology Pair</Text>
            <Text style={styles.line}>
              Life path: {result.pair.lifePath[0]} & {result.pair.lifePath[1]}
            </Text>
            <Text style={styles.line}>
              Expression: {result.pair.expression[0]} & {result.pair.expression[1]}
            </Text>
            <Text style={styles.sectionTitle}>Breakdown</Text>
            <Text style={styles.line}>Life path alignment: {result.breakdown.lifePath}%</Text>
            <Text style={styles.line}>Expression alignment: {result.breakdown.expression}%</Text>
            <Text style={styles.line}>Emotional dynamic: {result.breakdown.emotional}%</Text>
            <Text style={styles.sectionTitle}>Strengths</Text>
            {result.strengths.map((item) => (
              <Text key={item} style={styles.line}>- {item}</Text>
            ))}
            <Text style={styles.sectionTitle}>Challenges</Text>
            {result.challenges.map((item) => (
              <Text key={item} style={styles.line}>- {item}</Text>
            ))}
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {result.recommendations.map((item) => (
              <Text key={item} style={styles.line}>- {item}</Text>
            ))}
            {result.relationshipInsights.map((insight) => (
              <View key={insight.title} style={styles.insightBox}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                {insight.lines.map((line) => (
                  <Text key={line} style={styles.line}>
                    - {line}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function clampScore(value: number): number {
  if (value < 35) {
    return 35;
  }

  if (value > 98) {
    return 98;
  }

  return value;
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
  line: { color: "#222222" },
  insightBox: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 8,
    padding: 10,
    gap: 4,
    backgroundColor: "#fcfcff"
  },
  insightTitle: {
    fontWeight: "700",
    color: "#1f6feb",
    textTransform: "uppercase",
    fontSize: 12,
    letterSpacing: 0.5
  }
});
