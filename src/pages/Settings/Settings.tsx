import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import { getApiBaseUrl } from "../../utils/apiBaseUrl";

type SettingsProps = {
  onLogout: () => Promise<void>;
};

export function Settings({ onLogout }: SettingsProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.card}>
          <Text style={styles.label}>API base URL</Text>
          <Text style={styles.value}>{getApiBaseUrl()}</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={() => void onLogout()}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 26, fontWeight: "800" },
  card: { backgroundColor: "#ffffff", borderRadius: 12, padding: 14, gap: 6 },
  label: { color: "#6a6a6a", fontWeight: "600" },
  value: { color: "#1d1d1d" },
  logoutButton: {
    backgroundColor: "#ffffff",
    borderColor: "#d1242f",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12
  },
  logoutText: { color: "#d1242f", fontWeight: "700" }
});
