import { useEffect, useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { getApiErrorMessage } from "../../services/apiClient";
import type { Reading } from "../../types/reading.types";

type ReadingDetailProps = {
  readingId: string;
  onLoad: (readingId: string) => Promise<Reading>;
  onBack: () => void;
};

export function ReadingDetail({ readingId, onLoad, onBack }: ReadingDetailProps) {
  const [reading, setReading] = useState<Reading | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await onLoad(readingId);
        setReading(response);
      } catch (loadError) {
        setError(getApiErrorMessage(loadError, "Unable to load this reading"));
      } finally {
        setLoading(false);
      }
    })();
  }, [onLoad, readingId]);

  const sections = useMemo(() => {
    if (!reading) {
      return [];
    }

    return buildSectionsFromResults(reading.results);
  }, [reading]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={onBack}>
          <Text style={styles.backLink}>Back</Text>
        </Pressable>
        {loading ? <Text>Loading...</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && reading ? (
          <View style={styles.card}>
            <Text style={styles.title}>
              {reading.firstName} {reading.lastName}
            </Text>
            <Text>Birth date: {reading.birthDate.slice(0, 10)}</Text>
            <Text>Category: {reading.category}</Text>
            <Text style={styles.createdAt}>Created: {reading.createdAt.slice(0, 10)}</Text>
          </View>
        ) : null}
        {!loading && reading ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Numerology results</Text>
            {sections.length ? (
              sections.map((section) => (
                <View key={section.key} style={styles.resultBlock}>
                  <Text style={styles.resultBlockTitle}>{section.label}</Text>
                  {section.lines.map((line) => (
                    <Text key={line.key} style={styles.resultLine}>
                      {line.label}: {line.value}
                    </Text>
                  ))}
                </View>
              ))
            ) : (
              <Text style={styles.resultLine}>No formatted values available for this reading.</Text>
            )}
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

type ResultLine = {
  key: string;
  label: string;
  value: string;
};

type ResultSection = {
  key: string;
  label: string;
  lines: ResultLine[];
};

function buildSectionsFromResults(results: Record<string, unknown>): ResultSection[] {
  return Object.entries(results)
    .map(([sectionKey, rawSection]) => {
      if (!isPlainRecord(rawSection)) {
        return {
          key: sectionKey,
          label: formatLabel(sectionKey),
          lines: [
            {
              key: `${sectionKey}-value`,
              label: "Value",
              value: formatValue(rawSection)
            }
          ]
        };
      }

      const lines: ResultLine[] = Object.entries(rawSection)
        .map(([entryKey, entryValue]) => ({
          key: `${sectionKey}-${entryKey}`,
          label: formatLabel(entryKey),
          value: formatValue(entryValue)
        }))
        .filter((line) => line.value !== "-");

      if (!lines.length) {
        return null;
      }

      return {
        key: sectionKey,
        label: formatLabel(sectionKey),
        lines
      };
    })
    .filter((section): section is ResultSection => section !== null);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function formatLabel(raw: string): string {
  if (!raw) {
    return raw;
  }

  const withSpaces = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  container: {
    padding: 16,
    gap: 10,
    paddingBottom: 30
  },
  backLink: {
    color: "#1f6feb",
    fontWeight: "700"
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    gap: 6
  },
  title: {
    fontSize: 20,
    fontWeight: "800"
  },
  createdAt: {
    color: "#5f5f5f"
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6
  },
  resultBlock: {
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    paddingTop: 8,
    gap: 4
  },
  resultBlockTitle: {
    fontWeight: "700",
    color: "#212121"
  },
  resultLine: {
    color: "#333333"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  }
});
