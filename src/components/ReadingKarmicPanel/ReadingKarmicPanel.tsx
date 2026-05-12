import { StyleSheet, Text, View } from "react-native";

import { useKarmicDebtsDataset } from "../../hooks/useKarmicDebtsDataset";
import { pickDatasetEntryByNumber, toFiniteInt } from "../../utils/numerologyInterpretationPick";
import { isPlainObjectRecord } from "../../utils/structuredPayload";
import { InterpretationBlocks } from "../InterpretationBlocks/InterpretationBlocks";
import { NumberBadge } from "../NumberBadge/NumberBadge";
import { RichAccordion } from "../RichAccordion/RichAccordion";

type ReadingKarmicPanelProps = {
  readingId: string;
  karmic: unknown;
  isActive: boolean;
};

const DEBT_KEYS: { key: string; label: string }[] = [
  { key: "lifePathDebt", label: "Dette liée au chemin de vie" },
  { key: "expressionDebt", label: "Dette liée à l’expression" },
  { key: "soulUrgeDebt", label: "Dette liée à la motivation intérieure" },
  { key: "personalityDebt", label: "Dette liée à la personnalité" },
  { key: "birthdayDebt", label: "Dette liée au jour de naissance" }
];

export function ReadingKarmicPanel({ readingId, karmic, isActive }: ReadingKarmicPanelProps) {
  if (!isPlainObjectRecord(karmic)) {
    return (
      <Text style={styles.muted}>
        Données karmiques absentes. Enregistrez une lecture complète pour afficher cette section.
      </Text>
    );
  }

  const karmicNumbers = karmic.karmicNumbers;
  const cycleKarmic = karmic.cycleKarmicNumbers;
  const karmicDebts = karmic.karmicDebts;

  const needsDebtCopy =
    isPlainObjectRecord(karmicDebts) &&
    DEBT_KEYS.some(({ key }) => {
      const row = karmicDebts[key];
      return isPlainObjectRecord(row) && row.isKarmicDebt === true;
    });

  const { state: debtDatasetState } = useKarmicDebtsDataset(isActive, needsDebtCopy, readingId);

  const hasKarmicNumbers = isPlainObjectRecord(karmicNumbers) && Array.isArray(karmicNumbers.karmicDefinitions);
  const hasCycle = isPlainObjectRecord(cycleKarmic) && Array.isArray(cycleKarmic.cycleKarmicDefinitions);

  if (!hasKarmicNumbers && !hasCycle && !isPlainObjectRecord(karmicDebts)) {
    return (
      <Text style={styles.muted}>
        Structure karmique incomplète (anciennes lectures). Recalculez la lecture pour obtenir les textes
        détaillés.
      </Text>
    );
  }

  const debtCatalog = debtDatasetState.status === "ready" ? debtDatasetState.data : null;

  return (
    <View style={styles.gap}>
      {needsDebtCopy && (debtDatasetState.status === "idle" || debtDatasetState.status === "loading") ? (
        <Text style={styles.muted}>Chargement des textes sur les dettes…</Text>
      ) : null}
      {debtDatasetState.status === "error" ? <Text style={styles.error}>{debtDatasetState.message}</Text> : null}

      {hasKarmicNumbers ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Nombres karmiques (date)</Text>
          {typeof karmicNumbers.fullName === "string" ? (
            <Text style={styles.meta}>Référence : {karmicNumbers.fullName}</Text>
          ) : null}
          {(karmicNumbers.karmicDefinitions as unknown[]).map((def, index) => {
            if (!isPlainObjectRecord(def)) {
              return null;
            }
            const n = toFiniteInt(def.number);
            return (
              <RichAccordion
                key={`kn-${String(n)}-${index}`}
                title="Nombre absent de la date"
                subtitle={subtitleNum(n)}
                defaultExpanded={index === 0}
              >
                <View style={styles.row}>{n !== null ? <NumberBadge value={n} /> : null}</View>
                <InterpretationBlocks entry={def} />
              </RichAccordion>
            );
          })}
        </View>
      ) : null}

      {hasCycle ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Cycles karmiques (nom)</Text>
          {typeof cycleKarmic.fullName === "string" ? (
            <Text style={styles.meta}>Nom analysé : {cycleKarmic.fullName}</Text>
          ) : null}
          {(cycleKarmic.cycleKarmicDefinitions as unknown[]).map((def, index) => {
            if (!isPlainObjectRecord(def)) {
              return null;
            }
            const n = toFiniteInt(def.number);
            return (
              <RichAccordion
                key={`ck-${String(n)}-${index}`}
                title="Lettre absente du nom"
                subtitle={subtitleNum(n)}
                defaultExpanded={index === 0 && !hasKarmicNumbers}
              >
                <View style={styles.row}>{n !== null ? <NumberBadge value={n} /> : null}</View>
                <InterpretationBlocks entry={def} />
              </RichAccordion>
            );
          })}
        </View>
      ) : null}

      {isPlainObjectRecord(karmicDebts) ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Dettes karmiques (noyau)</Text>
          {DEBT_KEYS.map(({ key, label }, index) => {
            const row = karmicDebts[key];
            if (!isPlainObjectRecord(row)) {
              return null;
            }
            const n = toFiniteInt(row.number);
            const isDebt = row.isKarmicDebt === true;
            const debtType = toFiniteInt(row.karmicDebtType);
            const debtEntry =
              isDebt && debtType !== null && debtCatalog !== null
                ? pickDatasetEntryByNumber(debtCatalog, debtType)
                : null;

            return (
              <RichAccordion
                key={key}
                title={label}
                subtitle={
                  isDebt && debtType !== null
                    ? `Dette ${debtType}`
                    : n !== null
                      ? `Nombre ${n} (pas de dette karmique classique)`
                      : "Indisponible"
                }
                defaultExpanded={index === 0 && !hasKarmicNumbers && !hasCycle}
              >
                <View style={styles.row}>
                  {n !== null ? <NumberBadge value={n} /> : null}
                </View>
                {isDebt && debtType !== null ? (
                  debtEntry !== null ? (
                    <InterpretationBlocks entry={debtEntry} />
                  ) : (
                    <Text style={styles.muted}>
                      Dette {debtType} détectée ; texte catalogue non chargé ou indisponible.
                    </Text>
                  )
                ) : (
                  <Text style={styles.muted}>Pas de dette karmique sur ce nombre pour ce profil.</Text>
                )}
              </RichAccordion>
            );
          })}
        </View>
      ) : null}
    </View>
  );
}

function subtitleNum(n: number | null): string {
  return n !== null ? `Nombre ${n}` : "Nombre indisponible";
}

const styles = StyleSheet.create({
  gap: { gap: 14 },
  block: { gap: 8 },
  sectionHeading: { fontSize: 13, fontWeight: "800", color: "#1f6feb", textTransform: "uppercase" },
  muted: { color: "#666666" },
  error: { color: "#b42318", fontWeight: "600" },
  meta: { fontSize: 12, color: "#5c5c6b", marginBottom: 4 },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: 8 }
});
