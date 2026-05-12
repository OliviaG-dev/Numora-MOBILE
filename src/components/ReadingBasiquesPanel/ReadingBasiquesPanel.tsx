import { StyleSheet, Text, View } from "react-native";

import type { BasiqueDatasetsBundle } from "../../hooks/useBasiqueInterpretationDatasets";
import { useBasiqueInterpretationDatasets } from "../../hooks/useBasiqueInterpretationDatasets";
import {
  buildStructuredSections,
  isPlainObjectRecord
} from "../../utils/structuredPayload";
import { pickDatasetEntryByNumber, pickRealisationEntry, toFiniteInt } from "../../utils/numerologyInterpretationPick";
import { InterpretationBlocks } from "../InterpretationBlocks/InterpretationBlocks";
import { NumberBadge } from "../NumberBadge/NumberBadge";
import { RichAccordion } from "../RichAccordion/RichAccordion";

type ReadingBasiquesPanelProps = {
  readingId: string;
  core: unknown;
  place: unknown;
  isActive: boolean;
};

const ASPECTS: {
  id: string;
  label: string;
  coreKey: string;
  datasetKey: keyof BasiqueDatasetsBundle;
  pick: "flat" | "realisation";
}[] = [
  { id: "lp", label: "Chemin de vie", coreKey: "lifePath", datasetKey: "lifePathData", pick: "flat" },
  { id: "ex", label: "Expression", coreKey: "expression", datasetKey: "expressionData", pick: "flat" },
  { id: "su", label: "Motivation intérieure (âme)", coreKey: "soulUrge", datasetKey: "soulUrgeData", pick: "flat" },
  { id: "pe", label: "Personnalité", coreKey: "personality", datasetKey: "personalityData", pick: "flat" },
  { id: "bd", label: "Jour de naissance", coreKey: "birthday", datasetKey: "birthdayData", pick: "flat" },
  { id: "he", label: "Nombre du cœur", coreKey: "heart", datasetKey: "heartNumberPersonalData", pick: "flat" },
  { id: "re", label: "Nombre de réalisation", coreKey: "realisation", datasetKey: "realisationNumberData", pick: "realisation" }
];

export function ReadingBasiquesPanel({ readingId, core, place, isActive }: ReadingBasiquesPanelProps) {
  const { state } = useBasiqueInterpretationDatasets(isActive, readingId);

  if (!isPlainObjectRecord(core)) {
    return (
      <Text style={styles.muted}>
        Données du noyau (core) absentes ou incomplètes. Enregistrez une lecture complète via le calcul
        numérologique pour afficher les interprétations.
      </Text>
    );
  }

  const placeSections =
    place !== undefined && place !== null ? buildStructuredSections(place) : [];

  return (
    <View style={styles.gap}>
      <Text style={styles.sectionHeading}>Noyau</Text>
      {(state.status === "idle" || state.status === "loading") ? (
        <Text style={styles.muted}>Chargement des textes…</Text>
      ) : null}
      {state.status === "error" ? <Text style={styles.error}>{state.message}</Text> : null}

      {ASPECTS.map((aspect, index) => {
        const n = toFiniteInt(core[aspect.coreKey]);
        const entry =
          state.status === "ready"
            ? aspect.pick === "realisation"
              ? pickRealisationEntry(state.data[aspect.datasetKey], n)
              : pickDatasetEntryByNumber(state.data[aspect.datasetKey], n)
            : null;

        return (
          <RichAccordion
            key={aspect.id}
            title={aspect.label}
            subtitle={n !== null ? `Nombre ${n}` : "Nombre indisponible"}
            defaultExpanded={index === 0}
          >
            <View style={styles.row}>
              {n !== null ? <NumberBadge value={n} /> : null}
            </View>
            {state.status === "ready" ? <InterpretationBlocks entry={entry} /> : null}
          </RichAccordion>
        );
      })}

      {placeSections.length > 0 ? (
        <View style={styles.placeBlock}>
          <Text style={styles.sectionHeading}>Lieu</Text>
          {placeSections.map((sec) => (
            <View key={sec.key} style={styles.placeSection}>
              <Text style={styles.placeSectionTitle}>{sec.label}</Text>
              {sec.lines.map((line) => (
                <Text key={line.key} style={styles.placeLine}>
                  {line.label}: {line.value}
                </Text>
              ))}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  gap: { gap: 10 },
  sectionHeading: { fontSize: 13, fontWeight: "800", color: "#1f6feb", textTransform: "uppercase" },
  muted: { color: "#666666" },
  error: { color: "#b42318", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  placeBlock: { marginTop: 8, gap: 8 },
  placeSection: { gap: 4, paddingTop: 8, borderTopWidth: 1, borderTopColor: "#efefef" },
  placeSectionTitle: { fontWeight: "700", color: "#212121" },
  placeLine: { color: "#333333" }
});
