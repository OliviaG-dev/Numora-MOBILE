import { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { ReadingDetailTabs } from "../../components/ReadingDetailTabs/ReadingDetailTabs";
import { getApiErrorMessage } from "../../services/apiClient";
import { formatIsoToEuropean } from "../../utils/europeanDate";
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable onPress={onBack}>
          <Text style={styles.backLink}>Retour</Text>
        </Pressable>
        {loading ? <Text>Chargement…</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {!loading && reading ? (
          <View style={styles.card}>
            <Text style={styles.title}>
              {reading.firstName} {reading.lastName}
            </Text>
            {typeof reading.results.readingTitle === "string" && reading.results.readingTitle.trim() ? (
              <Text style={styles.line}>Lecture : {reading.results.readingTitle.trim()}</Text>
            ) : null}
            <Text style={styles.line}>
              Date de naissance : {formatIsoToEuropean(reading.birthDate.slice(0, 10))}
            </Text>
            <Text style={styles.line}>Catégorie : {reading.category}</Text>
            <Text style={styles.createdAt}>Créée le : {reading.createdAt.slice(0, 10)}</Text>
          </View>
        ) : null}
        {!loading && reading ? <ReadingDetailTabs readingId={reading.id} results={reading.results} /> : null}
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
  line: {
    color: "#333333"
  },
  createdAt: {
    color: "#5f5f5f"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  }
});
