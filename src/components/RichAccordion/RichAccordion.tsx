import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RichAccordionProps = {
  title: string;
  subtitle?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
};

export function RichAccordion({ title, subtitle, defaultExpanded = false, children }: RichAccordionProps) {
  const [open, setOpen] = useState(defaultExpanded);

  return (
    <View style={styles.card}>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
      >
        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Text style={styles.chevron}>{open ? "−" : "+"}</Text>
      </Pressable>
      {open ? <View style={styles.body}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e4e6ef",
    backgroundColor: "#fafbff",
    overflow: "hidden"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8
  },
  headerText: { flex: 1, gap: 2 },
  title: { fontSize: 15, fontWeight: "800", color: "#141414" },
  subtitle: { fontSize: 12, color: "#5c5c6b", fontWeight: "600" },
  chevron: { fontSize: 18, fontWeight: "700", color: "#1f6feb", minWidth: 22, textAlign: "center" },
  body: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 2,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#ececf3"
  }
});
