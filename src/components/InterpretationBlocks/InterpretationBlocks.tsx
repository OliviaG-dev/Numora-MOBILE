import { StyleSheet, Text, View } from "react-native";

import { isPlainObjectRecord } from "../../utils/structuredPayload";

type InterpretationBlocksProps = {
  entry: unknown;
};

export function InterpretationBlocks({ entry }: InterpretationBlocksProps) {
  if (entry === null || entry === undefined) {
    return <Text style={styles.muted}>Pas d’entrée catalogue pour ce nombre.</Text>;
  }

  if (Array.isArray(entry)) {
    const items = entry.map((item) => String(item)).filter(Boolean);
    if (!items.length) {
      return <Text style={styles.muted}>Données vides.</Text>;
    }
    return <KeywordChips items={items} />;
  }

  if (!isPlainObjectRecord(entry)) {
    return <Text style={styles.paragraph}>{String(entry)}</Text>;
  }

  return <InterpretationRecord record={entry} />;
}

export function KeywordChips({ items }: { items: string[] }) {
  if (!items.length) {
    return null;
  }
  return (
    <View style={styles.chipRow}>
      {items.map((word) => (
        <View key={word} style={styles.chip}>
          <Text style={styles.chipText}>{word}</Text>
        </View>
      ))}
    </View>
  );
}

function InterpretationRecord({ record }: { record: Record<string, unknown> }) {
  const title = readString(record.title);
  const subtitle = readString(record.subtitle);
  const domain = readString(record.domain);
  const hebrewName = readString(record.hebrewName);
  const name = readString(record.name);
  const summary = readString(record.summary);
  const keywordLabel = readString(record.keyword);
  const interpretationText = readString(record.interpretation);
  const motsCles = readString(record.mots_cles);
  const description =
    readString(record.description) ||
    readString(record.details) ||
    readString(record.essence);
  const strengthsStr = typeof record.strengths === "string" ? readString(record.strengths) : "";
  const challengesStr =
    typeof record.challenges === "string" ? readString(record.challenges) : "";
  const strengthsList = Array.isArray(record.strengths) ? readStringArray(record.strengths) : [];
  const challengesList = Array.isArray(record.challenges) ? readStringArray(record.challenges) : [];
  const strengths = strengthsStr || readString(record.strength);
  const challenges =
    challengesStr || readString(record.challenge ?? record.emotional_challenge);
  const mission = readString(record.mission);
  const favorable = readString(record.favorable_for);
  const unfavorable = readString(record.unfavorable_for);
  const loveLanguage = readString(record.love_language);
  const arcana = readString(record.arcana);
  const pillar = readString(record.pillar);
  const keywords = readStringArray(record.keywords);
  const emotionalNeeds = record.emotional_needs;

  return (
    <View style={styles.gap}>
      {title ? <Text style={styles.heading}>{title}</Text> : null}
      {name && name !== title ? <Text style={styles.subheading}>{name}</Text> : null}
      {hebrewName ? <Text style={styles.hebrew}>{hebrewName}</Text> : null}
      {subtitle ? <Text style={styles.subheading}>{subtitle}</Text> : null}
      {domain ? (
        <View>
          <Text style={styles.kicker}>Domaine</Text>
          <Text style={styles.paragraph}>{domain}</Text>
        </View>
      ) : null}
      {keywords.length ? <KeywordChips items={keywords} /> : null}
      {summary ? (
        <View>
          <Text style={styles.kicker}>Résumé</Text>
          <Text style={styles.paragraph}>{summary}</Text>
        </View>
      ) : null}
      {motsCles ? (
        <View>
          <Text style={styles.kicker}>Mots-clés</Text>
          <Text style={styles.paragraph}>{motsCles}</Text>
        </View>
      ) : null}
      {keywordLabel ? (
        <View>
          <Text style={styles.kicker}>Mot-clé</Text>
          <Text style={styles.paragraph}>{keywordLabel}</Text>
        </View>
      ) : null}
      {interpretationText ? (
        <View>
          <Text style={styles.kicker}>Interprétation</Text>
          <Text style={styles.paragraph}>{interpretationText}</Text>
        </View>
      ) : null}
      {description ? (
        <View>
          <Text style={styles.kicker}>{interpretationText ? "Détails" : "Interprétation"}</Text>
          <Text style={styles.paragraph}>{description}</Text>
        </View>
      ) : null}
      {strengthsList.length ? (
        <View>
          <Text style={styles.kicker}>Forces</Text>
          {strengthsList.map((line) => (
            <Text key={line} style={styles.bullet}>
              {"\u2022"} {line}
            </Text>
          ))}
        </View>
      ) : strengths ? (
        <View>
          <Text style={styles.kicker}>Forces</Text>
          <Text style={styles.paragraph}>{strengths}</Text>
        </View>
      ) : null}
      {challengesList.length ? (
        <View>
          <Text style={styles.kicker}>Défis</Text>
          {challengesList.map((line) => (
            <Text key={line} style={styles.bullet}>
              {"\u2022"} {line}
            </Text>
          ))}
        </View>
      ) : challenges ? (
        <View>
          <Text style={styles.kicker}>Défis</Text>
          <Text style={styles.paragraph}>{challenges}</Text>
        </View>
      ) : null}
      {mission ? (
        <View>
          <Text style={styles.kicker}>Mission</Text>
          <Text style={styles.paragraph}>{mission}</Text>
        </View>
      ) : null}
      {favorable ? (
        <View>
          <Text style={styles.kicker}>Favorable pour</Text>
          <Text style={styles.paragraph}>{favorable}</Text>
        </View>
      ) : null}
      {unfavorable ? (
        <View>
          <Text style={styles.kicker}>Moins favorable pour</Text>
          <Text style={styles.paragraph}>{unfavorable}</Text>
        </View>
      ) : null}
      {loveLanguage ? (
        <View>
          <Text style={styles.kicker}>Langage du cœur</Text>
          <Text style={styles.paragraph}>{loveLanguage}</Text>
        </View>
      ) : null}
      {arcana ? (
        <View>
          <Text style={styles.kicker}>Arcane</Text>
          <Text style={styles.paragraph}>{arcana}</Text>
        </View>
      ) : null}
      {pillar ? (
        <View>
          <Text style={styles.kicker}>Pilier</Text>
          <Text style={styles.paragraph}>{pillar}</Text>
        </View>
      ) : null}
      {Array.isArray(emotionalNeeds) && emotionalNeeds.length ? (
        <View>
          <Text style={styles.kicker}>Besoins émotionnels</Text>
          {emotionalNeeds.map((need, index) => (
            <Text key={`${String(need)}-${index}`} style={styles.bullet}>
              {"\u2022"} {String(need)}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function readString(value: unknown): string {
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function readStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map((item) => String(item)).filter((s) => s.length > 0);
}

const styles = StyleSheet.create({
  gap: { gap: 10 },
  muted: { color: "#666666", fontStyle: "italic" },
  heading: { fontSize: 16, fontWeight: "800", color: "#1a1a1a" },
  subheading: { fontSize: 14, fontWeight: "600", color: "#3a3a48" },
  hebrew: { fontSize: 13, color: "#5c5c6b" },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1f6feb",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2
  },
  paragraph: { fontSize: 14, lineHeight: 21, color: "#2a2a33" },
  bullet: { fontSize: 14, lineHeight: 21, color: "#2a2a33", marginLeft: 4 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#f0f2fa",
    borderWidth: 1,
    borderColor: "#dcdce8"
  },
  chipText: { fontSize: 12, fontWeight: "600", color: "#3a3a48" }
});
