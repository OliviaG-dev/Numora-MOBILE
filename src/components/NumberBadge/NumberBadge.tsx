import { StyleSheet, Text, View } from "react-native";

type NumberBadgeProps = {
  value: number;
  label?: string;
};

export function NumberBadge({ value, label }: NumberBadgeProps) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.badge}>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  label: { fontSize: 12, fontWeight: "700", color: "#444452" },
  badge: {
    minWidth: 36,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: "#eaf2ff",
    borderWidth: 1,
    borderColor: "#c8dafb"
  },
  value: { fontSize: 15, fontWeight: "800", color: "#1f6feb", textAlign: "center" }
});
