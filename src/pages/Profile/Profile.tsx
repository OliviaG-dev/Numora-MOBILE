import { SafeAreaView, StyleSheet, Text, View } from "react-native";

type ProfileProps = {
  email: string;
};

export function Profile({ email }: ProfileProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{email}</Text>
        </View>
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
  value: { fontSize: 16, fontWeight: "700", color: "#1d1d1d" }
});
