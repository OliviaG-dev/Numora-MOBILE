import { useEffect } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";

import { ReadingList } from "../../components/ReadingList/ReadingList";
import type { Reading } from "../../types/reading.types";

type ReadingsProps = {
  readings: Reading[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onOpenReading: (readingId: string) => void;
  onDeleteReading: (readingId: string) => Promise<void>;
  onGoToCreate: () => void;
};

export function Readings({
  readings,
  loading,
  error,
  onRefresh,
  onOpenReading,
  onDeleteReading,
  onGoToCreate
}: ReadingsProps) {
  useEffect(() => {
    void onRefresh();
  }, [onRefresh]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Mes lectures</Text>
          <Pressable style={styles.primaryButton} onPress={onGoToCreate}>
            <Text style={styles.primaryText}>Nouvelle</Text>
          </Pressable>
        </View>
        {loading ? <Text>Chargement…</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ReadingList
          readings={readings}
          onOpen={onOpenReading}
          onDelete={(id) => void onDeleteReading(id)}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  container: { flex: 1, padding: 16, gap: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 26, fontWeight: "800" },
  primaryButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  primaryText: { color: "#ffffff", fontWeight: "700" },
  error: { color: "#d1242f", fontWeight: "600" }
});
