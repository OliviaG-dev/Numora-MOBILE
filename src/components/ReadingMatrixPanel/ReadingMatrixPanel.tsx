import { StyleSheet, Text, View } from "react-native";

import { useMatrixInterpretationDatasets } from "../../hooks/useMatrixInterpretationDatasets";
import { computeMatrixHeartLineFromApi } from "../../utils/matrixHeartLineFromApi";
import {
  pickBaseNumberEntry,
  pickCentralMissionEntry,
  pickExternalRelationText,
  pickFeminineLineEntry,
  pickMasculineLineEntry,
  pickMatrixMoneyLoveText,
  pickRelationHeartText,
  readMatrixNumber
} from "../../utils/matrixDatasetLookup";
import { isPlainObjectRecord } from "../../utils/structuredPayload";
import { InterpretationBlocks } from "../InterpretationBlocks/InterpretationBlocks";
import { NumberBadge } from "../NumberBadge/NumberBadge";
import { RichAccordion } from "../RichAccordion/RichAccordion";
type ReadingMatrixPanelProps = {
  readingId: string;
  matrixDestiny: unknown;
  isActive: boolean;
};

const CHAKRA_ORDER = [
  "sahasrara",
  "ajna",
  "vissudha",
  "anahata",
  "manipura",
  "svadhisthana",
  "muladhara"
] as const;

const CHAKRA_LABELS: Record<(typeof CHAKRA_ORDER)[number], string> = {
  sahasrara: "Sahasrara (Couronne)",
  ajna: "Ajna (3e œil)",
  vissudha: "Vishuddha (Gorge)",
  anahata: "Anahata (Cœur)",
  manipura: "Manipura (Plexus solaire)",
  svadhisthana: "Svadhisthana (Sacré)",
  muladhara: "Muladhara (Racine)"
};

const KARMIC_BLOCKS: {
  title: string;
  hint: string;
  primary: string;
  secondary?: string;
  tertiary?: string;
  quaternary?: string;
}[] = [
  {
    title: "Queue karmique financière",
    hint: "Dettes karmiques liées à l’argent et aux ressources matérielles",
    primary: "financialKarmicTail.primary",
    secondary: "financialKarmicTail.secondary"
  },
  {
    title: "Zone de talent",
    hint: "Dons naturels et compétences hérités karmiquement",
    primary: "talentZone.primary",
    secondary: "talentZone.secondary"
  },
  {
    title: "Parents & lien en société",
    hint: "Relations karmiques parentales et intégration sociale",
    primary: "parents.primary",
    secondary: "parents.secondary"
  },
  {
    title: "Vie karmique",
    hint: "Expériences et leçons accumulées",
    primary: "karmicLife.primary",
    secondary: "karmicLife.secondary"
  },
  {
    title: "Antécédents féminins",
    hint: "Héritage spirituel de la lignée maternelle",
    primary: "feminineAncestry.primary",
    secondary: "feminineAncestry.secondary",
    tertiary: "feminineAncestry.tertiary",
    quaternary: "feminineAncestry.quaternary"
  },
  {
    title: "Antécédents masculins",
    hint: "Héritage spirituel de la lignée paternelle",
    primary: "masculineAncestry.primary",
    secondary: "masculineAncestry.secondary",
    tertiary: "masculineAncestry.tertiary",
    quaternary: "masculineAncestry.quaternary"
  }
];

export function ReadingMatrixPanel({ readingId, matrixDestiny, isActive }: ReadingMatrixPanelProps) {
  const { state } = useMatrixInterpretationDatasets(isActive, readingId);

  if (!isPlainObjectRecord(matrixDestiny)) {
    return (
      <Text style={styles.muted}>
        Données Matrix absentes. Enregistrez une lecture complète pour afficher cette section.
      </Text>
    );
  }

  const base = matrixDestiny.base;
  const center = matrixDestiny.center;
  const special = matrixDestiny.special;
  const external = matrixDestiny.externalRelations;
  const karmicLines = matrixDestiny.karmicLines;
  const chakras = matrixDestiny.chakras;
  const cycles = matrixDestiny.cycles;
  const commonEnergy = matrixDestiny.commonEnergyZone;

  const heartLine = parseHeartLine(matrixDestiny) ?? computeMatrixHeartLineFromApi(matrixDestiny);

  const ds = state.status === "ready" ? state.data : null;

  return (
    <View style={styles.gap}>
      {(state.status === "idle" || state.status === "loading") && (
        <Text style={styles.muted}>Chargement des interprétations Matrix…</Text>
      )}
      {state.status === "error" ? <Text style={styles.error}>{state.message}</Text> : null}

      {ds ? (
        <>
          <Text style={styles.sectionHeading}>Nombres de base</Text>
          <RichAccordion title="Jour de naissance" subtitle={subNum(readMatrixNumber(base, "day"))} defaultExpanded>
            <Row n={readMatrixNumber(base, "day")} />
            <InterpretationBlocks entry={pickBaseNumberEntry(ds.baseNumberData, "jour", readMatrixNumber(base, "day"))} />
          </RichAccordion>
          <RichAccordion title="Mois de naissance" subtitle={subNum(readMatrixNumber(base, "month"))}>
            <Row n={readMatrixNumber(base, "month")} />
            <InterpretationBlocks entry={pickBaseNumberEntry(ds.baseNumberData, "mois", readMatrixNumber(base, "month"))} />
          </RichAccordion>
          <RichAccordion title="Année de naissance" subtitle={subNum(readMatrixNumber(base, "year"))}>
            <Row n={readMatrixNumber(base, "year")} />
            <InterpretationBlocks entry={pickBaseNumberEntry(ds.baseNumberData, "annee", readMatrixNumber(base, "year"))} />
          </RichAccordion>
          <RichAccordion title="Mission de vie (base)" subtitle={subNum(readMatrixNumber(base, "lifeMission"))}>
            <Row n={readMatrixNumber(base, "lifeMission")} />
            <InterpretationBlocks
              entry={pickBaseNumberEntry(ds.baseNumberData, "mission_vie", readMatrixNumber(base, "lifeMission"))}
            />
          </RichAccordion>

          <Text style={styles.sectionHeading}>Mission centrale</Text>
          <RichAccordion title="Équilibre central" subtitle={subNum(readMatrixNumber(center, "mission"))}>
            <Row n={readMatrixNumber(center, "mission")} />
            <InterpretationBlocks
              entry={pickCentralMissionEntry(ds.centralMissionData, readMatrixNumber(center, "mission"))}
            />
          </RichAccordion>

          <Text style={styles.sectionHeading}>Ligne masculine (paternelle)</Text>
          <LineTriple
            labels={["Esprit (jour + mois)", "Cœur (mission)", "Énergie (année + mission vie)"]}
            numbers={[
              readMatrixNumber(isPlainObjectRecord(center) ? center.maleLine : null, "dayMonth"),
              readMatrixNumber(isPlainObjectRecord(center) ? center.maleLine : null, "mission"),
              readMatrixNumber(isPlainObjectRecord(center) ? center.maleLine : null, "dayYear")
            ]}
            aspects={["spirit", "heart", "energy"] as const}
            pick={(aspect, n) => pickMasculineLineEntry(ds.masculineLineData, aspect, n)}
          />

          <Text style={styles.sectionHeading}>Ligne féminine (maternelle)</Text>
          <LineTriple
            labels={["Âme (mois + année)", "Cœur (mission)", "Énergie (mission + jour)"]}
            numbers={[
              readMatrixNumber(isPlainObjectRecord(center) ? center.femaleLine : null, "monthYear"),
              readMatrixNumber(isPlainObjectRecord(center) ? center.femaleLine : null, "mission"),
              readMatrixNumber(isPlainObjectRecord(center) ? center.femaleLine : null, "monthDay")
            ]}
            aspects={["spirit", "heart", "energy"] as const}
            pick={(aspect, n) => pickFeminineLineEntry(ds.feminineLineData, aspect, n)}
          />

          <Text style={styles.sectionHeading}>Domaines cœur / argent / pivot</Text>
          <RichAccordion title="Amour" subtitle={subNum(readMatrixNumber(special, "love"))} defaultExpanded>
            <Row n={readMatrixNumber(special, "love")} />
            <Text style={styles.paragraph}>
              {pickMatrixMoneyLoveText(ds.matrixMoneyLoveData, "love", readMatrixNumber(special, "love")) ??
                "Pas de texte catalogue pour ce nombre."}
            </Text>
          </RichAccordion>
          <RichAccordion title="Équilibre (pivot)" subtitle={subNum(readMatrixNumber(special, "balance"))}>
            <Row n={readMatrixNumber(special, "balance")} />
            <Text style={styles.paragraph}>
              {pickMatrixMoneyLoveText(ds.matrixMoneyLoveData, "pivot", readMatrixNumber(special, "balance")) ??
                "Pas de texte catalogue pour ce nombre."}
            </Text>
          </RichAccordion>
          <RichAccordion title="Argent" subtitle={subNum(readMatrixNumber(special, "money"))}>
            <Row n={readMatrixNumber(special, "money")} />
            <Text style={styles.paragraph}>
              {pickMatrixMoneyLoveText(ds.matrixMoneyLoveData, "money", readMatrixNumber(special, "money")) ??
                "Pas de texte catalogue pour ce nombre."}
            </Text>
          </RichAccordion>

          {heartLine ? (
            <>
              <Text style={styles.sectionHeading}>Ligne du cœur</Text>
              <RichAccordion title="Physique (réception)" subtitle={subNum(heartLine.physique)} defaultExpanded>
                <Row n={heartLine.physique} />
                <Text style={styles.paragraph}>
                  {pickRelationHeartText(ds.matrixRelationsHeartData, "interior", heartLine.physique) ??
                    "Pas de texte catalogue."}
                </Text>
              </RichAccordion>
              <RichAccordion title="Énergie (don)" subtitle={subNum(heartLine.energy)}>
                <Row n={heartLine.energy} />
                <Text style={styles.paragraph}>
                  {pickRelationHeartText(ds.matrixRelationsHeartData, "exterior", heartLine.energy) ??
                    "Pas de texte catalogue."}
                </Text>
              </RichAccordion>
              <RichAccordion title="Émotions (synthèse)" subtitle={subNum(heartLine.emotions)}>
                <Row n={heartLine.emotions} />
                <Text style={styles.muted}>Synthèse des deux axes cœur (catalogue web : pas de texte séparé).</Text>
              </RichAccordion>
            </>
          ) : null}

          <Text style={styles.sectionHeading}>Relations extérieures</Text>
          <RichAccordion title="Pouvoir personnel" subtitle={subNum(readMatrixNumber(external, "personalPower"))}>
            <Row n={readMatrixNumber(external, "personalPower")} />
            <Text style={styles.paragraph}>
              {pickExternalRelationText(
                ds.externalRelationsData,
                "pouvoir_social",
                readMatrixNumber(external, "personalPower")
              ) ?? "Pas de texte catalogue."}
            </Text>
          </RichAccordion>
          <RichAccordion title="Influence sociale" subtitle={subNum(readMatrixNumber(external, "socialInfluence"))}>
            <Row n={readMatrixNumber(external, "socialInfluence")} />
            <Text style={styles.paragraph}>
              {pickExternalRelationText(
                ds.externalRelationsData,
                "influence_social",
                readMatrixNumber(external, "socialInfluence")
              ) ?? "Pas de texte catalogue."}
            </Text>
          </RichAccordion>
        </>
      ) : null}

      <Text style={styles.sectionHeading}>Lignes karmiques (nombres)</Text>
      {isPlainObjectRecord(karmicLines) ? (
        <View style={styles.karmicGap}>
          {KARMIC_BLOCKS.map((block) => (
            <View key={block.title} style={styles.karmicCard}>
              <Text style={styles.karmicTitle}>{block.title}</Text>
              <Text style={styles.karmicHint}>{block.hint}</Text>
              <View style={styles.badgeRow}>
                {readNested(karmicLines, block.primary) !== null ? (
                  <NumberBadge value={readNested(karmicLines, block.primary)!} label="1" />
                ) : null}
                {block.secondary && readNested(karmicLines, block.secondary) !== null ? (
                  <NumberBadge value={readNested(karmicLines, block.secondary)!} label="2" />
                ) : null}
                {block.tertiary && readNested(karmicLines, block.tertiary) !== null ? (
                  <NumberBadge value={readNested(karmicLines, block.tertiary)!} label="3" />
                ) : null}
                {block.quaternary && readNested(karmicLines, block.quaternary) !== null ? (
                  <NumberBadge value={readNested(karmicLines, block.quaternary)!} label="4" />
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.muted}>Non disponible.</Text>
      )}

      <Text style={styles.sectionHeading}>Chakras (valeurs)</Text>
      {isPlainObjectRecord(chakras) ? (
        <View style={styles.karmicGap}>
          {CHAKRA_ORDER.map((key) => {
            const node = chakras[key];
            if (!isPlainObjectRecord(node)) {
              return null;
            }
            return (
              <RichAccordion key={key} title={CHAKRA_LABELS[key]} defaultExpanded={key === "sahasrara"}>
                <View style={styles.triRow}>
                  <MiniBadge label="Physique" n={readMatrixNumber(node, "physique")} />
                  <MiniBadge label="Énergie" n={readMatrixNumber(node, "energy")} />
                  <MiniBadge label="Émotions" n={readMatrixNumber(node, "emotions")} />
                </View>
              </RichAccordion>
            );
          })}
        </View>
      ) : (
        <Text style={styles.muted}>Non disponible.</Text>
      )}

      <Text style={styles.sectionHeading}>Cycles (âge → nombre)</Text>
      {isPlainObjectRecord(cycles) ? (
        <View style={styles.cycleWrap}>
          {Object.keys(cycles)
            .map((k) => Number(k))
            .filter((n) => Number.isFinite(n))
            .sort((a, b) => a - b)
            .map((age) => (
              <View key={String(age)} style={styles.cycleRow}>
                <Text style={styles.cycleAge}>{age} ans</Text>
                <NumberBadge value={Number(cycles[String(age)])} />
              </View>
            ))}
        </View>
      ) : (
        <Text style={styles.muted}>Non disponible.</Text>
      )}

      <Text style={styles.sectionHeading}>Zone d’énergie commune</Text>
      {isPlainObjectRecord(commonEnergy) ? (
        <View style={styles.triRow}>
          <MiniBadge label="Physique" n={readMatrixNumber(commonEnergy, "physics")} />
          <MiniBadge label="Énergie" n={readMatrixNumber(commonEnergy, "energy")} />
          <MiniBadge label="Émotions" n={readMatrixNumber(commonEnergy, "emotions")} />
        </View>
      ) : (
        <Text style={styles.muted}>Non disponible.</Text>
      )}

    </View>
  );
}

function parseHeartLine(matrix: Record<string, unknown>): {
  physique: number;
  energy: number;
  emotions: number;
} | null {
  const hl = matrix.heartLine;
  if (!isPlainObjectRecord(hl)) {
    return null;
  }
  const physique = readMatrixNumber(hl, "physique");
  const energy = readMatrixNumber(hl, "energy");
  const emotions = readMatrixNumber(hl, "emotions");
  if (physique === null || energy === null || emotions === null) {
    return null;
  }
  return { physique, energy, emotions };
}

function subNum(n: number | null): string {
  return n !== null ? `Nombre ${n}` : "Nombre indisponible";
}

function Row({ n }: { n: number | null }) {
  return <View style={styles.row}>{n !== null ? <NumberBadge value={n} /> : null}</View>;
}

function MiniBadge({ label, n }: { label: string; n: number | null }) {
  return (
    <View style={styles.mini}>
      <Text style={styles.miniLabel}>{label}</Text>
      {n !== null ? <NumberBadge value={n} /> : <Text style={styles.muted}>-</Text>}
    </View>
  );
}

function readNested(root: Record<string, unknown>, path: string): number | null {
  const parts = path.split(".");
  let cur: unknown = root;
  for (const p of parts) {
    if (!isPlainObjectRecord(cur)) {
      return null;
    }
    cur = cur[p];
  }
  return typeof cur === "number" && Number.isFinite(cur) ? cur : null;
}

function LineTriple({
  labels,
  numbers,
  aspects,
  pick
}: {
  labels: [string, string, string];
  numbers: [number | null, number | null, number | null];
  aspects: readonly ["spirit", "heart", "energy"];
  pick: (aspect: "spirit" | "heart" | "energy", n: number | null) => unknown;
}) {
  return (
    <>
      {[0, 1, 2].map((i) => (
        <RichAccordion
          key={labels[i]}
          title={labels[i]}
          subtitle={subNum(numbers[i])}
          defaultExpanded={i === 0}
        >
          <Row n={numbers[i]} />
          <InterpretationBlocks entry={pick(aspects[i], numbers[i])} />
        </RichAccordion>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  gap: { gap: 12 },
  sectionHeading: { fontSize: 13, fontWeight: "800", color: "#1f6feb", textTransform: "uppercase", marginTop: 4 },
  muted: { color: "#666666" },
  error: { color: "#b42318", fontWeight: "600" },
  paragraph: { fontSize: 14, lineHeight: 21, color: "#2a2a33" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  karmicGap: { gap: 8 },
  karmicCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e4e6ef",
    backgroundColor: "#fafbff",
    gap: 6
  },
  karmicTitle: { fontWeight: "800", color: "#1a1a1a" },
  karmicHint: { fontSize: 12, color: "#5c5c6b" },
  badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, alignItems: "center" },
  triRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  mini: { gap: 4 },
  miniLabel: { fontSize: 11, fontWeight: "700", color: "#5c5c6b" },
  cycleWrap: { gap: 6 },
  cycleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  cycleAge: { width: 52, fontWeight: "700", color: "#333" }
});
