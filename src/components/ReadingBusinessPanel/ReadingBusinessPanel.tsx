import { StyleSheet, Text, View } from "react-native";

import { useBusinessInterpretationDatasets } from "../../hooks/useBusinessInterpretationDatasets";
import { pickDatasetEntryByNumber, toFiniteInt } from "../../utils/numerologyInterpretationPick";
import { isPlainObjectRecord } from "../../utils/structuredPayload";
import { InterpretationBlocks } from "../InterpretationBlocks/InterpretationBlocks";
import { NumberBadge } from "../NumberBadge/NumberBadge";
import { RichAccordion } from "../RichAccordion/RichAccordion";

type ReadingBusinessPanelProps = {
  readingId: string;
  business: unknown;
  isActive: boolean;
};

export function ReadingBusinessPanel({ readingId, business, isActive }: ReadingBusinessPanelProps) {
  const { state } = useBusinessInterpretationDatasets(isActive, readingId);

  if (!isPlainObjectRecord(business)) {
    return (
      <Text style={styles.muted}>
        Données Travail & business absentes. Enregistrez une lecture complète pour afficher cette section.
      </Text>
    );
  }

  const expression = business.expression;
  const active = business.active;
  const hereditary = business.hereditary;

  const ds = state.status === "ready" ? state.data : null;

  return (
    <View style={styles.gap}>
      {(state.status === "idle" || state.status === "loading") && (
        <Text style={styles.muted}>Chargement des interprétations…</Text>
      )}
      {state.status === "error" ? <Text style={styles.error}>{state.message}</Text> : null}

      {ds ? (
        <>
          <BusinessBlock
            title="Expression professionnelle"
            hint="Vibration du nom complet (toutes les lettres)"
            block={expression}
            dataset={ds.expressionBusinessData}
            defaultExpanded
          />
          <BusinessBlock
            title="Actif (prénom)"
            hint="Premier prénom — image d’impact et élan"
            block={active}
            dataset={ds.actifBusinessData}
          />
          <BusinessBlock
            title="Héréditaire (nom)"
            hint="Nom de famille — héritage et ancrage"
            block={hereditary}
            dataset={ds.hereditaryBusinessData}
          />
        </>
      ) : null}
    </View>
  );
}

function BusinessBlock({
  title,
  hint,
  block,
  dataset,
  defaultExpanded
}: {
  title: string;
  hint: string;
  block: unknown;
  dataset: unknown;
  defaultExpanded?: boolean;
}) {
  if (!isPlainObjectRecord(block)) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.muted}>Non disponible.</Text>
      </View>
    );
  }
  const value = toFiniteInt(block.value);
  const raw = toFiniteInt(block.raw);
  const entry = pickDatasetEntryByNumber(dataset, value);

  return (
    <RichAccordion
      title={title}
      subtitle={value !== null ? `Nombre réduit ${value}` : "Nombre indisponible"}
      defaultExpanded={defaultExpanded ?? false}
    >
      <Text style={styles.hint}>{hint}</Text>
      <View style={styles.row}>
        {value !== null ? <NumberBadge value={value} label="Réduit" /> : null}
        {raw !== null ? <Text style={styles.raw}>Somme lettres : {raw}</Text> : null}
      </View>
      <InterpretationBlocks entry={entry} />
    </RichAccordion>
  );
}

const styles = StyleSheet.create({
  gap: { gap: 10 },
  muted: { color: "#666666" },
  error: { color: "#b42318", fontWeight: "600" },
  card: { padding: 10, gap: 4 },
  cardTitle: { fontWeight: "800" },
  hint: { fontSize: 12, color: "#5c5c6b", marginBottom: 6 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 8 },
  raw: { fontSize: 13, color: "#444452" }
});
