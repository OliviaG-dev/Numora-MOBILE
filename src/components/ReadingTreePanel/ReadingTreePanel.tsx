import { StyleSheet, Text, View } from "react-native";

import type { DominantPillarKey } from "../../constants/treePillarCopy";
import { TREE_PILLAR_COPY } from "../../constants/treePillarCopy";
import { useTreeInterpretationDatasets } from "../../hooks/useTreeInterpretationDatasets";
import { pickDatasetEntryByNumber, toFiniteInt } from "../../utils/numerologyInterpretationPick";
import { createPathKey } from "../../utils/treePathKey";
import { isPlainObjectRecord } from "../../utils/structuredPayload";
import { InterpretationBlocks } from "../InterpretationBlocks/InterpretationBlocks";
import { NumberBadge } from "../NumberBadge/NumberBadge";
import { RichAccordion } from "../RichAccordion/RichAccordion";

type ReadingTreePanelProps = {
  readingId: string;
  treeOfLife: unknown;
  isActive: boolean;
};

const SEPHIRA_KEYS = [
  "kether",
  "chokhmah",
  "binah",
  "chesed",
  "gevurah",
  "tipheret",
  "netzach",
  "hod",
  "yesod",
  "malkuth"
] as const;

const SEPHIRA_INDEX: Record<(typeof SEPHIRA_KEYS)[number], number> = {
  kether: 1,
  chokhmah: 2,
  binah: 3,
  chesed: 4,
  gevurah: 5,
  tipheret: 6,
  netzach: 7,
  hod: 8,
  yesod: 9,
  malkuth: 10
};

export function ReadingTreePanel({ readingId, treeOfLife, isActive }: ReadingTreePanelProps) {
  const { state } = useTreeInterpretationDatasets(isActive, readingId);

  if (!isPlainObjectRecord(treeOfLife)) {
    return (
      <Text style={styles.muted}>
        Données Arbre de vie absentes. Enregistrez une lecture complète pour afficher cette section.
      </Text>
    );
  }

  const values = treeOfLife.sephirothValues;
  const paths = treeOfLife.significantPaths;
  const pillarBalance = treeOfLife.pillarBalance;
  const dominantPillar = treeOfLife.dominantPillar;

  const ds = state.status === "ready" ? state.data : null;

  const dominantKey =
    dominantPillar === "mercy" || dominantPillar === "severity" || dominantPillar === "equilibrium"
      ? (dominantPillar as DominantPillarKey)
      : "equilibrium";

  return (
    <View style={styles.gap}>
      {(state.status === "idle" || state.status === "loading") && (
        <Text style={styles.muted}>Chargement des interprétations…</Text>
      )}
      {state.status === "error" ? <Text style={styles.error}>{state.message}</Text> : null}

      <Text style={styles.sectionHeading}>Équilibre des piliers</Text>
      {isPlainObjectRecord(pillarBalance) ? (
        <View style={styles.pillarRow}>
          <View style={styles.pillarCell}>
            <Text style={styles.pillarLabel}>Miséricorde</Text>
            {toFiniteInt(pillarBalance.mercy) !== null ? (
              <NumberBadge value={toFiniteInt(pillarBalance.mercy)!} />
            ) : (
              <Text style={styles.muted}>-</Text>
            )}
          </View>
          <View style={styles.pillarCell}>
            <Text style={styles.pillarLabel}>Rigueur</Text>
            {toFiniteInt(pillarBalance.severity) !== null ? (
              <NumberBadge value={toFiniteInt(pillarBalance.severity)!} />
            ) : (
              <Text style={styles.muted}>-</Text>
            )}
          </View>
          <View style={styles.pillarCell}>
            <Text style={styles.pillarLabel}>Équilibre</Text>
            {toFiniteInt(pillarBalance.equilibrium) !== null ? (
              <NumberBadge value={toFiniteInt(pillarBalance.equilibrium)!} />
            ) : (
              <Text style={styles.muted}>-</Text>
            )}
          </View>
        </View>
      ) : null}
      <View style={styles.pillarHighlight}>
        <Text style={styles.pillarHighlightTitle}>Pilier dominant</Text>
        <Text style={styles.pillarHighlightName}>{TREE_PILLAR_COPY[dominantKey].name}</Text>
        <Text style={styles.paragraph}>{TREE_PILLAR_COPY[dominantKey].description}</Text>
        <Text style={styles.guidance}>{TREE_PILLAR_COPY[dominantKey].guidance}</Text>
      </View>

      <Text style={styles.sectionHeading}>Sephiroth</Text>
      {isPlainObjectRecord(values) && ds ? (
        <>
          {SEPHIRA_KEYS.map((key, index) => {
            const n = toFiniteInt(values[key]);
            const general = pickDatasetEntryByNumber(ds.sephirothData, SEPHIRA_INDEX[key]);
            const personalized = pickSephiraNumber(ds.sephirothNumberData, key, n);
            return (
              <RichAccordion
                key={key}
                title={formatSephiraTitle(key, general)}
                subtitle={n !== null ? `Nombre ${n}` : "Nombre indisponible"}
                defaultExpanded={index === 0}
              >
                <View style={styles.row}>{n !== null ? <NumberBadge value={n} /> : null}</View>
                {general ? (
                  <View style={styles.blockGap}>
                    <Text style={styles.kicker}>Tradition</Text>
                    <InterpretationBlocks entry={general} />
                  </View>
                ) : null}
                {personalized ? (
                  <View style={styles.blockGap}>
                    <Text style={styles.kicker}>Personnalisé (nombre)</Text>
                    <InterpretationBlocks entry={personalized} />
                  </View>
                ) : (
                  <Text style={styles.muted}>Pas d’entrée personnalisée pour cette combinaison.</Text>
                )}
              </RichAccordion>
            );
          })}
        </>
      ) : (
        <Text style={styles.muted}>Valeurs Sephiroth non disponibles.</Text>
      )}

      <Text style={styles.sectionHeading}>Chemins marquants</Text>
      {Array.isArray(paths) && ds ? (
        paths.map((item, index) => {
          if (!isPlainObjectRecord(item)) {
            return null;
          }
          const pathObj = item.path;
          const value = toFiniteInt(item.value);
          if (!isPlainObjectRecord(pathObj)) {
            return null;
          }
          const from = typeof pathObj.from === "string" ? pathObj.from : "";
          const to = typeof pathObj.to === "string" ? pathObj.to : "";
          const pathKey = createPathKey(from, to, ds.pathsNumberData);
          const pathGeneral = isPlainObjectRecord(ds.pathsData) ? ds.pathsData[pathKey] : null;
          const pathPersonal = pickPathNumber(ds.pathsNumberData, pathKey, value);
          const title =
            isPlainObjectRecord(pathGeneral) && typeof pathGeneral.name === "string"
              ? pathGeneral.name
              : `${from} → ${to}`;

          return (
            <RichAccordion
              key={`${pathKey}-${String(index)}`}
              title={title}
              subtitle={value !== null ? `Valeur du chemin : ${value}` : "Valeur indisponible"}
              defaultExpanded={index === 0}
            >
              <View style={styles.row}>{value !== null ? <NumberBadge value={value} /> : null}</View>
              {pathGeneral ? (
                <View style={styles.blockGap}>
                  <Text style={styles.kicker}>Tradition</Text>
                  <InterpretationBlocks entry={pathGeneral} />
                </View>
              ) : null}
              {pathPersonal ? (
                <View style={styles.blockGap}>
                  <Text style={styles.kicker}>Personnalisé</Text>
                  <InterpretationBlocks entry={pathPersonal} />
                </View>
              ) : (
                <Text style={styles.muted}>Pas d’entrée personnalisée pour ce chemin et ce nombre.</Text>
              )}
            </RichAccordion>
          );
        })
      ) : (
        <Text style={styles.muted}>Aucun chemin significatif dans les résultats.</Text>
      )}
    </View>
  );
}

function formatSephiraTitle(key: string, general: unknown): string {
  if (isPlainObjectRecord(general) && typeof general.name === "string") {
    return general.name;
  }
  return key.charAt(0).toUpperCase() + key.slice(1);
}

function pickSephiraNumber(sephirothNumberData: unknown, sephiraKey: string, n: number | null): unknown {
  if (n === null || !isPlainObjectRecord(sephirothNumberData)) {
    return null;
  }
  const block = sephirothNumberData[sephiraKey];
  return pickDatasetEntryByNumber(block, n);
}

function pickPathNumber(pathsNumberData: unknown, pathKey: string, n: number | null): unknown {
  if (n === null || !isPlainObjectRecord(pathsNumberData)) {
    return null;
  }
  const block = pathsNumberData[pathKey];
  return pickDatasetEntryByNumber(block, n);
}

const styles = StyleSheet.create({
  gap: { gap: 12 },
  sectionHeading: { fontSize: 13, fontWeight: "800", color: "#1f6feb", textTransform: "uppercase", marginTop: 4 },
  muted: { color: "#666666" },
  error: { color: "#b42318", fontWeight: "600" },
  paragraph: { fontSize: 14, lineHeight: 21, color: "#2a2a33" },
  guidance: { fontSize: 13, lineHeight: 20, color: "#444452", fontStyle: "italic", marginTop: 6 },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1f6feb",
    textTransform: "uppercase",
    marginBottom: 4
  },
  blockGap: { gap: 6, marginTop: 8 },
  pillarRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  pillarCell: { gap: 4 },
  pillarLabel: { fontSize: 12, fontWeight: "700", color: "#5c5c6b" },
  pillarHighlight: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#f4f7ff",
    borderWidth: 1,
    borderColor: "#d0ddf5",
    gap: 6
  },
  pillarHighlightTitle: { fontSize: 11, fontWeight: "800", color: "#1f6feb", textTransform: "uppercase" },
  pillarHighlightName: { fontSize: 16, fontWeight: "800", color: "#141414" }
});
