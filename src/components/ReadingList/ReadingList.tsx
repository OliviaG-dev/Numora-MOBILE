import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import type { Reading } from "../../types/reading.types";

type ReadingListProps = {
  readings: Reading[];
  onOpen: (readingId: string) => void;
  onDelete: (readingId: string) => void;
};

export function ReadingList({ readings, onOpen, onDelete }: ReadingListProps) {
  if (readings.length === 0) {
    return <Text style={styles.empty}>No reading yet</Text>;
  }

  return (
    <FlatList
      data={readings}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>
            {item.firstName} {item.lastName}
          </Text>
          <Text style={styles.meta}>
            {item.category} • {new Date(item.createdAt).toLocaleDateString()}
          </Text>
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => onOpen(item.id)}>
              <Text style={styles.primaryButtonText}>Open</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={() => onDelete(item.id)}>
              <Text style={styles.secondaryButtonText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 12,
    paddingBottom: 24
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    gap: 8
  },
  title: {
    fontSize: 16,
    fontWeight: "700"
  },
  meta: {
    color: "#606060"
  },
  actions: {
    flexDirection: "row",
    gap: 10
  },
  primaryButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d1242f",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  secondaryButtonText: {
    color: "#d1242f",
    fontWeight: "700"
  },
  empty: {
    color: "#666666",
    textAlign: "center",
    marginTop: 24
  }
});
