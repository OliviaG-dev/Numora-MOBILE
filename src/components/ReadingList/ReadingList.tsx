import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../styles/theme";
import type { Reading } from "../../types/reading.types";

type ReadingListProps = {
  readings: Reading[];
  onOpen: (readingId: string) => void;
  onDelete: (readingId: string) => void;
  /** Liste statique (pas de scroll imbriqué), pour l’accueil. */
  compact?: boolean;
  /** Style sombre pour fond cosmique. */
  variant?: "default" | "dark";
};

export function ReadingList({
  readings,
  onOpen,
  onDelete,
  compact = false,
  variant = "default"
}: ReadingListProps) {
  const isDark = variant === "dark";

  if (readings.length === 0) {
    return (
      <Text style={[styles.empty, isDark && styles.emptyDark]}>
        {isDark ? "Aucune lecture pour le moment." : "No reading yet"}
      </Text>
    );
  }

  const content = readings.map((item) => (
    <View key={item.id} style={[styles.card, isDark && styles.cardDark]}>
      <Text style={[styles.title, isDark && styles.titleDark]}>
        {item.firstName} {item.lastName}
      </Text>
      <Text style={[styles.meta, isDark && styles.metaDark]}>
        {item.category} • {new Date(item.createdAt).toLocaleDateString("fr-FR")}
      </Text>
      <View style={styles.actions}>
        <Pressable
          style={[styles.primaryButton, isDark && styles.primaryButtonDark]}
          onPress={() => onOpen(item.id)}
        >
          <Text style={[styles.primaryButtonText, isDark && styles.primaryButtonTextDark]}>
            {isDark ? "Ouvrir" : "Open"}
          </Text>
        </Pressable>
        <Pressable
          style={[styles.secondaryButton, isDark && styles.secondaryButtonDark]}
          onPress={() => onDelete(item.id)}
        >
          <Text style={[styles.secondaryButtonText, isDark && styles.secondaryButtonTextDark]}>
            {isDark ? "Supprimer" : "Delete"}
          </Text>
        </Pressable>
      </View>
    </View>
  ));

  if (compact) {
    return <View style={styles.list}>{content}</View>;
  }

  return <View style={[styles.list, styles.listPadded]}>{content}</View>;
}

const styles = StyleSheet.create({
  list: {
    gap: 12
  },
  listPadded: {
    paddingBottom: 24
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    gap: 8
  },
  cardDark: {
    backgroundColor: "rgba(15, 15, 35, 0.9)",
    borderWidth: 1,
    borderColor: colors.purpleBorder
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111111"
  },
  titleDark: {
    color: colors.textPrimary
  },
  meta: {
    color: "#606060"
  },
  metaDark: {
    color: colors.textMuted
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
  primaryButtonDark: {
    backgroundColor: colors.secondaryGold
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  primaryButtonTextDark: {
    color: colors.textOnGold
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#d1242f",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14
  },
  secondaryButtonDark: {
    borderColor: colors.error
  },
  secondaryButtonText: {
    color: "#d1242f",
    fontWeight: "700"
  },
  secondaryButtonTextDark: {
    color: colors.error
  },
  empty: {
    color: "#666666",
    textAlign: "center",
    marginTop: 24
  },
  emptyDark: {
    color: colors.textMuted,
    marginTop: 8
  }
});
