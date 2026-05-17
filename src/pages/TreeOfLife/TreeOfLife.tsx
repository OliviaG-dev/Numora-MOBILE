import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { EuropeanDateInput } from "../../components/EuropeanDateInput/EuropeanDateInput";
import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import { EU_DATE_FORMAT_LABEL, parseDateInputToIso } from "../../utils/europeanDate";
import {
  buildStructuredSections,
  formatStructuredLabel,
  formatStructuredValue,
  isPlainObjectRecord
} from "../../utils/structuredPayload";

type TreeOfLifeProps = {
  initialTree: unknown;
};

export function TreeOfLife({ initialTree }: TreeOfLifeProps) {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [tree, setTree] = useState<unknown>(initialTree);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setError(null);
    setIsLoading(true);
    const birthDateIso = parseDateInputToIso(birthDate);
    if (!birthDateIso) {
      setError(`Date de naissance invalide (${EU_DATE_FORMAT_LABEL}).`);
      setIsLoading(false);
      return;
    }
    try {
      const response = await calculateNumerology({
        fullName: fullName.trim(),
        birthDate: birthDateIso
      });
      setTree(response.result.treeOfLife);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to calculate Tree of Life"));
    } finally {
      setIsLoading(false);
    }
  };

  const sections = buildStructuredSections(tree);
  const visualization = toTreeVisualization(tree);
  const isDisabled = isLoading || !fullName.trim() || !birthDate.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Tree of Life</Text>
        <Text style={styles.subtitle}>Calculate and inspect your Tree of Life from birth data.</Text>

        <TextInput
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <EuropeanDateInput value={birthDate} onChangeText={setBirthDate} inputStyle={styles.input} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={() => void handleCalculate()}
          disabled={isDisabled}
          style={[styles.button, isDisabled && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{isLoading ? "Calculating..." : "Calculate tree"}</Text>
        </Pressable>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Visual tree</Text>
          <View style={styles.visualCard}>
            {visualization.pillarBalance ? (
              <View style={styles.pillarRow}>
                <View style={[styles.pillarBadge, styles.pillarMercy]}>
                  <Text style={styles.pillarLabel}>Mercy</Text>
                  <Text style={styles.pillarValue}>{visualization.pillarBalance.mercy}</Text>
                </View>
                <View style={[styles.pillarBadge, styles.pillarEquilibrium]}>
                  <Text style={styles.pillarLabel}>Equilibrium</Text>
                  <Text style={styles.pillarValue}>{visualization.pillarBalance.equilibrium}</Text>
                </View>
                <View style={[styles.pillarBadge, styles.pillarSeverity]}>
                  <Text style={styles.pillarLabel}>Severity</Text>
                  <Text style={styles.pillarValue}>{visualization.pillarBalance.severity}</Text>
                </View>
              </View>
            ) : null}

            {visualization.dominantPillar ? (
              <Text style={styles.dominantText}>
                Dominant pillar: {formatStructuredLabel(visualization.dominantPillar)}
              </Text>
            ) : null}

            {visualization.sephirothValues ? (
              <View style={styles.treeLayout}>
                <View style={styles.rowCenter}>
                  <SephiraNode
                    label="Kether"
                    value={visualization.sephirothValues.kether}
                    variant="equilibrium"
                  />
                </View>
                <View style={styles.rowSides}>
                  <SephiraNode
                    label="Chokhmah"
                    value={visualization.sephirothValues.chokhmah}
                    variant="mercy"
                  />
                  <SephiraNode
                    label="Binah"
                    value={visualization.sephirothValues.binah}
                    variant="severity"
                  />
                </View>
                <View style={styles.rowSides}>
                  <SephiraNode
                    label="Chesed"
                    value={visualization.sephirothValues.chesed}
                    variant="mercy"
                  />
                  <SephiraNode
                    label="Gevurah"
                    value={visualization.sephirothValues.gevurah}
                    variant="severity"
                  />
                </View>
                <View style={styles.rowCenter}>
                  <SephiraNode
                    label="Tipheret"
                    value={visualization.sephirothValues.tipheret}
                    variant="equilibrium"
                  />
                </View>
                <View style={styles.rowSides}>
                  <SephiraNode
                    label="Netzach"
                    value={visualization.sephirothValues.netzach}
                    variant="mercy"
                  />
                  <SephiraNode
                    label="Hod"
                    value={visualization.sephirothValues.hod}
                    variant="severity"
                  />
                </View>
                <View style={styles.rowCenter}>
                  <SephiraNode
                    label="Yesod"
                    value={visualization.sephirothValues.yesod}
                    variant="equilibrium"
                  />
                </View>
                <View style={styles.rowCenter}>
                  <SephiraNode
                    label="Malkuth"
                    value={visualization.sephirothValues.malkuth}
                    variant="equilibrium"
                  />
                </View>
              </View>
            ) : (
              <Text style={styles.line}>No visual data yet. Run a calculation first.</Text>
            )}
          </View>
        </View>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Result</Text>
          {sections.length ? (
            sections.map((section) => (
              <View key={section.key} style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>{section.label}</Text>
                {section.lines.map((line) => (
                  <Text key={line.key} style={styles.line}>
                    {line.label}: {line.value}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.line}>No Tree of Life data yet. Run a calculation first.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SephirothValues = {
  kether: string;
  chokhmah: string;
  binah: string;
  chesed: string;
  gevurah: string;
  tipheret: string;
  netzach: string;
  hod: string;
  yesod: string;
  malkuth: string;
};

type TreeVisualization = {
  sephirothValues: SephirothValues | null;
  pillarBalance: { mercy: string; severity: string; equilibrium: string } | null;
  dominantPillar: string | null;
};

function toTreeVisualization(value: unknown): TreeVisualization {
  if (!isPlainObjectRecord(value)) {
    return {
      sephirothValues: null,
      pillarBalance: null,
      dominantPillar: null
    };
  }

  const sephirothValues = isPlainObjectRecord(value.sephirothValues)
    ? {
        kether: formatStructuredValue(value.sephirothValues.kether),
        chokhmah: formatStructuredValue(value.sephirothValues.chokhmah),
        binah: formatStructuredValue(value.sephirothValues.binah),
        chesed: formatStructuredValue(value.sephirothValues.chesed),
        gevurah: formatStructuredValue(value.sephirothValues.gevurah),
        tipheret: formatStructuredValue(value.sephirothValues.tipheret),
        netzach: formatStructuredValue(value.sephirothValues.netzach),
        hod: formatStructuredValue(value.sephirothValues.hod),
        yesod: formatStructuredValue(value.sephirothValues.yesod),
        malkuth: formatStructuredValue(value.sephirothValues.malkuth)
      }
    : null;

  const pillarBalance = isPlainObjectRecord(value.pillarBalance)
    ? {
        mercy: formatStructuredValue(value.pillarBalance.mercy),
        severity: formatStructuredValue(value.pillarBalance.severity),
        equilibrium: formatStructuredValue(value.pillarBalance.equilibrium)
      }
    : null;

  return {
    sephirothValues,
    pillarBalance,
    dominantPillar: typeof value.dominantPillar === "string" ? value.dominantPillar : null
  };
}

type SephiraNodeProps = {
  label: string;
  value: string;
  variant: "mercy" | "severity" | "equilibrium";
};

function SephiraNode({ label, value, variant }: SephiraNodeProps) {
  return (
    <View
      style={[
        styles.node,
        variant === "mercy"
          ? styles.nodeMercy
          : variant === "severity"
            ? styles.nodeSeverity
            : styles.nodeEquilibrium
      ]}
    >
      <Text style={styles.nodeValue}>{value}</Text>
      <Text style={styles.nodeLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  container: {
    padding: 16,
    gap: 10,
    paddingBottom: 32
  },
  title: {
    fontSize: 24,
    fontWeight: "800"
  },
  subtitle: {
    color: "#5f5f5f"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  },
  button: {
    marginTop: 4,
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  },
  resultCard: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    gap: 8
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700"
  },
  visualCard: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#ececf3",
    borderRadius: 12,
    padding: 10,
    gap: 10,
    backgroundColor: "#fcfcff"
  },
  pillarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8
  },
  pillarBadge: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1
  },
  pillarMercy: {
    backgroundColor: "#eef4ff",
    borderColor: "#bdd3ff"
  },
  pillarSeverity: {
    backgroundColor: "#fff0f0",
    borderColor: "#ffc5c5"
  },
  pillarEquilibrium: {
    backgroundColor: "#fff9e7",
    borderColor: "#ffe29a"
  },
  pillarLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#444444"
  },
  pillarValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "800",
    color: "#222222"
  },
  dominantText: {
    color: "#454545",
    fontWeight: "600"
  },
  treeLayout: {
    gap: 8
  },
  rowCenter: {
    alignItems: "center"
  },
  rowSides: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12
  },
  node: {
    minWidth: 96,
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center"
  },
  nodeMercy: {
    backgroundColor: "#eef4ff",
    borderColor: "#bdd3ff"
  },
  nodeSeverity: {
    backgroundColor: "#fff0f0",
    borderColor: "#ffc5c5"
  },
  nodeEquilibrium: {
    backgroundColor: "#fff9e7",
    borderColor: "#ffe29a"
  },
  nodeValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1f1f1f"
  },
  nodeLabel: {
    marginTop: 2,
    fontSize: 12,
    color: "#444444",
    fontWeight: "600"
  },
  sectionBlock: {
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    paddingTop: 8,
    gap: 4
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#212121"
  },
  line: {
    color: "#333333"
  }
});
