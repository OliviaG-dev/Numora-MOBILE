import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { formatStructuredLabel, formatStructuredValue, isPlainObjectRecord } from "../../utils/structuredPayload";
import { RichAccordion } from "../RichAccordion/RichAccordion";

type RichObjectPayloadProps = {
  title: string;
  data: unknown;
};

const MAX_DEPTH = 5;

export function RichObjectPayload({ title, data }: RichObjectPayloadProps) {
  if (data === undefined || data === null) {
    return (
      <View style={styles.block}>
        <Text style={styles.blockTitle}>{title}</Text>
        <Text style={styles.muted}>Non disponible.</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {renderNode(data, 0)}
    </View>
  );
}

function renderNode(value: unknown, depth: number): ReactNode {
  if (depth > MAX_DEPTH) {
    return <Text style={styles.muted}>…</Text>;
  }

  if (value === null || value === undefined) {
    return <Text style={styles.muted}>-</Text>;
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return <Text style={styles.scalar}>{String(value)}</Text>;
  }

  if (Array.isArray(value)) {
    if (!value.length) {
      return <Text style={styles.muted}>(vide)</Text>;
    }
    return (
      <View style={styles.gap}>
        {value.map((item, index) => (
          <View key={`i-${index}`} style={styles.arrayItem}>
            <Text style={styles.arrayIndex}>{index + 1}.</Text>
            <View style={styles.flex}>{renderNode(item, depth + 1)}</View>
          </View>
        ))}
      </View>
    );
  }

  if (!isPlainObjectRecord(value)) {
    return <Text style={styles.scalar}>{formatStructuredValue(value)}</Text>;
  }

  const entries = Object.entries(value);
  if (!entries.length) {
    return <Text style={styles.muted}>(objet vide)</Text>;
  }

  if (isFlatNumberRecord(value)) {
    return (
      <View style={styles.grid}>
        {entries.map(([key, v]) => (
          <View key={key} style={styles.gridCell}>
            <Text style={styles.gridLabel}>{formatStructuredLabel(key)}</Text>
            <Text style={styles.gridValue}>{formatStructuredValue(v)}</Text>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={styles.gap}>
      {entries.map(([key, child]) => (
        <RichAccordion key={key} title={formatStructuredLabel(key)} defaultExpanded={depth === 0}>
          {renderNode(child, depth + 1)}
        </RichAccordion>
      ))}
    </View>
  );
}

function isFlatNumberRecord(obj: Record<string, unknown>): boolean {
  return Object.values(obj).every(
    (v) =>
      typeof v === "number" ||
      typeof v === "string" ||
      typeof v === "boolean" ||
      v === null ||
      v === undefined
  );
}

const styles = StyleSheet.create({
  block: { gap: 10 },
  blockTitle: { fontSize: 16, fontWeight: "800", color: "#1a1a1a" },
  muted: { color: "#666666" },
  scalar: { fontSize: 14, lineHeight: 21, color: "#2a2a33" },
  gap: { gap: 8 },
  arrayItem: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  arrayIndex: { fontSize: 13, fontWeight: "800", color: "#1f6feb", minWidth: 22 },
  flex: { flex: 1 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  gridCell: {
    minWidth: "42%",
    flexGrow: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#fafbff",
    borderWidth: 1,
    borderColor: "#e4e6ef",
    gap: 4
  },
  gridLabel: { fontSize: 11, fontWeight: "700", color: "#5c5c6b", textTransform: "uppercase" },
  gridValue: { fontSize: 16, fontWeight: "800", color: "#1f6feb" }
});
