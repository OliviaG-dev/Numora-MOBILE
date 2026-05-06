import { useEffect } from "react";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { ReadingList } from "../../components/ReadingList/ReadingList";
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
  onGoToNumerology: () => void;
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
  onGoToNumerology,
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>{email}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.primaryButton} onPress={onGoToCreate}>
            <Text style={styles.primaryButtonText}>New reading</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToReadings}>
            <Text style={styles.primaryButtonText}>Readings</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToNumerology}>
            <Text style={styles.primaryButtonText}>Numerology</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToDateAnalyzer}>
            <Text style={styles.primaryButtonText}>Date analyzer</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToNameAnalyzer}>
            <Text style={styles.primaryButtonText}>Name analyzer</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToDailyVibration}>
            <Text style={styles.primaryButtonText}>Daily vibration</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToPlaceVibration}>
            <Text style={styles.primaryButtonText}>Place vibration</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToCompatibilityAnalyzer}>
            <Text style={styles.primaryButtonText}>Compatibility</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToProfile}>
            <Text style={styles.primaryButtonText}>Profile</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={onGoToSettings}>
            <Text style={styles.primaryButtonText}>Settings</Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} onPress={() => void onLogout()}>
            <Text style={styles.secondaryButtonText}>Logout</Text>
          </Pressable>
        </View>
        {loading ? <Text>Loading readings...</Text> : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <ReadingList
          readings={readings}
          onOpen={onOpenReading}
          onDelete={(id) => void onDeleteReading(id)}
        />
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
  title: {
    fontSize: 26,
    fontWeight: "800"
  },
  subtitle: {
    color: "#5f5f5f"
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginVertical: 10
  },
  primaryButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  secondaryButtonText: {
    color: "#222222",
    fontWeight: "700"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  }
});
