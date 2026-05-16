import { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

import { HomeSection } from "../../components/HomeSection/HomeSection";
import { NumerologyBackground } from "../../components/NumerologyBackground/NumerologyBackground";
import { ReadingList } from "../../components/ReadingList/ReadingList";
import { SKIP_AUTH } from "../../config/devAuth";
import { colors, spacing } from "../../styles/theme";
import type { Reading } from "../../types/reading.types";

type HomeProps = {
  email: string;
  readings: Reading[];
  loading: boolean;
  error: string | null;
  onRefresh: () => Promise<void>;
  onOpenReading: (readingId: string) => void;
  onDeleteReading: (readingId: string) => Promise<void>;
  onGoToCreate: () => void;
  onGoToDateAnalyzer: () => void;
  onGoToNameAnalyzer: () => void;
  onGoToDailyVibration: () => void;
  onGoToPlaceVibration: () => void;
  onGoToCompatibilityAnalyzer: () => void;
  onGoToReadings: () => void;
  onGoToProfile: () => void;
  onGoToSettings: () => void;
  onLogout: () => Promise<void>;
};

export function Home({
  email,
  readings,
  loading,
  error,
  onRefresh,
  onOpenReading,
  onDeleteReading,
  onGoToCreate,
  onGoToDateAnalyzer,
  onGoToNameAnalyzer,
  onGoToDailyVibration,
  onGoToPlaceVibration,
  onGoToCompatibilityAnalyzer,
  onGoToReadings,
  onGoToProfile,
  onGoToSettings,
  onLogout
}: HomeProps) {
  useEffect(() => {
    void onRefresh();
  }, [onRefresh]);

  const recentReadings = readings.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeArea}>
      <NumerologyBackground />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          {SKIP_AUTH ? (
            <Text style={styles.devBanner}>Mode démo — sans connexion (lectures locales)</Text>
          ) : null}
          <Text style={styles.email} numberOfLines={1}>
            {email}
          </Text>
          <View style={styles.topLinks}>
            <Pressable onPress={onGoToReadings} hitSlop={8}>
              <Text style={styles.topLink}>Lectures</Text>
            </Pressable>
            <Text style={styles.topSep}>·</Text>
            <Pressable onPress={onGoToProfile} hitSlop={8}>
              <Text style={styles.topLink}>Profil</Text>
            </Pressable>
            <Text style={styles.topSep}>·</Text>
            <Pressable onPress={onGoToSettings} hitSlop={8}>
              <Text style={styles.topLink}>Paramètres</Text>
            </Pressable>
            <Text style={styles.topSep}>·</Text>
            <Pressable onPress={() => void onLogout()} hitSlop={8}>
              <Text style={styles.topLinkMuted}>Déconnexion</Text>
            </Pressable>
          </View>
        </View>

        <HomeSection
          onGoToCreate={onGoToCreate}
          onGoToNameAnalyzer={onGoToNameAnalyzer}
          onGoToDateAnalyzer={onGoToDateAnalyzer}
          onGoToDailyVibration={onGoToDailyVibration}
          onGoToPlaceVibration={onGoToPlaceVibration}
          onGoToCompatibilityAnalyzer={onGoToCompatibilityAnalyzer}
        />

        <View style={styles.readingsBlock}>
          <View style={styles.readingsHeader}>
            <Text style={styles.readingsTitle}>Mes lectures</Text>
            {readings.length > 0 ? (
              <Pressable onPress={onGoToReadings}>
                <Text style={styles.readingsSeeAll}>Voir tout</Text>
              </Pressable>
            ) : null}
          </View>
          {loading ? (
            <ActivityIndicator color={colors.primaryPurpleLight} style={styles.loader} />
          ) : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
          {!loading && recentReadings.length > 0 ? (
            <ReadingList
              readings={recentReadings}
              onOpen={onOpenReading}
              onDelete={(id) => void onDeleteReading(id)}
              compact
              variant="dark"
            />
          ) : !loading && !error && readings.length === 0 ? (
            <Text style={styles.readingsEmpty}>
              Aucune lecture enregistrée. Utilise « Découvre toi » pour commencer.
            </Text>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bgPrimary
  },
  scroll: {
    flex: 1,
    zIndex: 1
  },
  scrollContent: {
    paddingBottom: spacing.xl
  },
  topBar: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    gap: spacing.xs
  },
  devBanner: {
    fontSize: 12,
    color: colors.secondaryGoldLight,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 4
  },
  email: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: "center"
  },
  topLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 4
  },
  topLink: {
    color: colors.secondaryGoldLight,
    fontWeight: "600",
    fontSize: 13
  },
  topLinkMuted: {
    color: colors.textMuted,
    fontWeight: "600",
    fontSize: 13
  },
  topSep: {
    color: colors.textMuted,
    fontSize: 13
  },
  readingsBlock: {
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    backgroundColor: "rgba(26, 26, 64, 0.85)",
    borderWidth: 1,
    borderColor: colors.purpleBorder
  },
  readingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm
  },
  readingsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.textPrimary
  },
  readingsSeeAll: {
    color: colors.secondaryGold,
    fontWeight: "600",
    fontSize: 14
  },
  readingsEmpty: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center"
  },
  loader: {
    marginVertical: spacing.sm
  },
  error: {
    color: colors.error,
    fontWeight: "600",
    marginBottom: spacing.sm
  }
});
