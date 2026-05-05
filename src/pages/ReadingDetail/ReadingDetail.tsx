import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

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
      } catch {
        setError("Unable to load this reading");
      } finally {
        setLoading(false);
      }
    })();
  }, [onLoad, readingId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
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
            <Text>Results: {JSON.stringify(reading.results, null, 2)}</Text>
          </View>
        ) : null}
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
  error: {
    color: "#d1242f",
    fontWeight: "600"
  }
});
