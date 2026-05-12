import { StyleSheet, Text, View } from "react-native";

import { useDatesInterpretationDatasets } from "../../hooks/useDatesInterpretationDatasets";
import { pickDatasetEntryByNumber, toFiniteInt } from "../../utils/numerologyInterpretationPick";
import { isPlainObjectRecord } from "../../utils/structuredPayload";
import { InterpretationBlocks } from "../InterpretationBlocks/InterpretationBlocks";
import { NumberBadge } from "../NumberBadge/NumberBadge";
import { RichAccordion } from "../RichAccordion/RichAccordion";

type ReadingDatesPanelProps = {
  readingId: string;
  personal: unknown;
  challenges: unknown;
  universalVibrations: unknown;
  isActive: boolean;
};

type PersonalSlice = { number: number | null; description: string };

export function ReadingDatesPanel({
  readingId,
  personal,
  challenges,
  universalVibrations,
  isActive
}: ReadingDatesPanelProps) {
  const { state } = useDatesInterpretationDatasets(isActive, readingId);

  const personalYear = readPersonalSlice(personal, "year");
  const personalMonth = readPersonalSlice(personal, "month");
  const personalDay = readPersonalSlice(personal, "day");

  const challengeBlock =
    isPlainObjectRecord(challenges) && challenges.challengeNumbers !== undefined
      ? challenges.challengeNumbers
      : null;

  const lifeCycles =
    isPlainObjectRecord(challenges) && challenges.lifeCycles !== undefined ? challenges.lifeCycles : null;

  const realizationPeriods =
    isPlainObjectRecord(challenges) && challenges.realizationPeriods !== undefined
      ? challenges.realizationPeriods
      : null;

  const vibeDataset = state.status === "ready" ? state.data.dateVibeData : null;
  const cyclePersonDataset = state.status === "ready" ? state.data.personelCycleData : null;
  const lifeCycleDataset = state.status === "ready" ? state.data.lifeCycleData : null;
  const realizationDataset = state.status === "ready" ? state.data.realizationPeriodData : null;

  const universal = isPlainObjectRecord(universalVibrations) ? universalVibrations : null;

  const hasAnyPersonal =
    personalYear.number !== null || personalMonth.number !== null || personalDay.number !== null;
  const hasChallengeData = isPlainObjectRecord(challengeBlock);
  const hasLifeCycles = isPlainObjectRecord(lifeCycles);
  const hasRealizationPeriods = isPlainObjectRecord(realizationPeriods);
  const hasUniversal = universal !== null;

  if (
    !hasAnyPersonal &&
    !hasChallengeData &&
    !hasLifeCycles &&
    !hasRealizationPeriods &&
    !hasUniversal
  ) {
    return (
      <Text style={styles.muted}>
        Données « dates » absentes ou incomplètes. Enregistrez une lecture complète pour afficher cette
        section.
      </Text>
    );
  }

  return (
    <View style={styles.gap}>
      {(state.status === "idle" || state.status === "loading") && (hasAnyPersonal || hasUniversal) ? (
        <Text style={styles.muted}>Chargement des textes…</Text>
      ) : null}
      {state.status === "error" ? <Text style={styles.error}>{state.message}</Text> : null}

      {hasAnyPersonal ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Nombres personnels</Text>
          <RichAccordion title="Année personnelle" subtitle={subtitleNum(personalYear.number)} defaultExpanded>
            <NumberRow n={personalYear.number} />
            {personalYear.description ? <Text style={styles.apiHint}>{personalYear.description}</Text> : null}
            {state.status === "ready" ? (
              <InterpretationBlocks entry={pickDatasetEntryByNumber(cyclePersonDataset, personalYear.number)} />
            ) : null}
          </RichAccordion>
          <RichAccordion title="Mois personnel" subtitle={subtitleNum(personalMonth.number)}>
            <NumberRow n={personalMonth.number} />
            {personalMonth.description ? <Text style={styles.apiHint}>{personalMonth.description}</Text> : null}
            {state.status === "ready" ? (
              <InterpretationBlocks entry={pickDatasetEntryByNumber(cyclePersonDataset, personalMonth.number)} />
            ) : null}
          </RichAccordion>
          <RichAccordion title="Jour personnel" subtitle={subtitleNum(personalDay.number)}>
            <NumberRow n={personalDay.number} />
            {personalDay.description ? <Text style={styles.apiHint}>{personalDay.description}</Text> : null}
            {state.status === "ready" ? (
              <InterpretationBlocks entry={pickDatasetEntryByNumber(cyclePersonDataset, personalDay.number)} />
            ) : null}
          </RichAccordion>
        </View>
      ) : null}

      {hasChallengeData ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Défis majeurs</Text>
          {(
            [
              ["first", "Premier défi majeur"],
              ["second", "Deuxième défi majeur"],
              ["third", "Troisième défi majeur"],
              ["fourth", "Défi ponctuel"]
            ] as const
          ).map(([key, label], index) => {
            const slice = readChallengeSlice(challengeBlock, key);
            return (
              <RichAccordion key={key} title={label} subtitle={subtitleNum(slice.number)} defaultExpanded={index === 0}>
                <NumberRow n={slice.number} />
                {slice.description ? <Text style={styles.paragraph}>{slice.description}</Text> : null}
              </RichAccordion>
            );
          })}
        </View>
      ) : null}

      {hasLifeCycles ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Cycles de vie</Text>
          {(
            [
              ["firstCycle", "Premier cycle"],
              ["secondCycle", "Deuxième cycle"],
              ["thirdCycle", "Troisième cycle"]
            ] as const
          ).map(([key, label], index) => {
            const n = toFiniteInt(lifeCycles[key]);
            return (
              <RichAccordion key={key} title={label} subtitle={subtitleNum(n)} defaultExpanded={index === 0}>
                <NumberRow n={n} />
                {state.status === "ready" ? (
                  <InterpretationBlocks entry={pickDatasetEntryByNumber(lifeCycleDataset, n)} />
                ) : null}
              </RichAccordion>
            );
          })}
        </View>
      ) : null}

      {hasRealizationPeriods ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Périodes de réalisation</Text>
          {(
            [
              ["firstPeriod", "Première période"],
              ["secondPeriod", "Deuxième période"],
              ["thirdPeriod", "Troisième période"],
              ["fourthPeriod", "Quatrième période"]
            ] as const
          ).map(([key, label], index) => {
            const n = toFiniteInt(realizationPeriods[key]);
            return (
              <RichAccordion key={key} title={label} subtitle={subtitleNum(n)} defaultExpanded={index === 0}>
                <NumberRow n={n} />
                {state.status === "ready" ? (
                  <InterpretationBlocks entry={pickDatasetEntryByNumber(realizationDataset, n)} />
                ) : null}
              </RichAccordion>
            );
          })}
        </View>
      ) : null}

      {hasUniversal ? (
        <View style={styles.block}>
          <Text style={styles.sectionHeading}>Vibrations universelles</Text>
          {(
            [
              ["day", "Jour"],
              ["month", "Mois"],
              ["year", "Année universelle"],
              ["universal", "Jour universel"]
            ] as const
          ).map(([key, label], index) => {
            const n = toFiniteInt(universal[key]);
            return (
              <RichAccordion key={key} title={label} subtitle={subtitleNum(n)} defaultExpanded={index === 0}>
                <NumberRow n={n} />
                {state.status === "ready" ? (
                  <InterpretationBlocks entry={pickDatasetEntryByNumber(vibeDataset, n)} />
                ) : null}
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

function NumberRow({ n }: { n: number | null }) {
  return (
    <View style={styles.row}>
      {n !== null ? <NumberBadge value={n} /> : null}
    </View>
  );
}

function readPersonalSlice(personal: unknown, key: "year" | "month" | "day"): PersonalSlice {
  if (!isPlainObjectRecord(personal)) {
    return { number: null, description: "" };
  }
  const block = personal[key];
  if (!isPlainObjectRecord(block)) {
    return { number: null, description: "" };
  }
  return {
    number: toFiniteInt(block.number),
    description: typeof block.description === "string" ? block.description : ""
  };
}

function readChallengeSlice(
  challengeBlock: Record<string, unknown>,
  key: "first" | "second" | "third" | "fourth"
): { number: number | null; description: string } {
  const block = challengeBlock[key];
  if (!isPlainObjectRecord(block)) {
    return { number: null, description: "" };
  }
  return {
    number: toFiniteInt(block.number),
    description: typeof block.description === "string" ? block.description : ""
  };
}

const styles = StyleSheet.create({
  gap: { gap: 14 },
  block: { gap: 8 },
  sectionHeading: { fontSize: 13, fontWeight: "800", color: "#1f6feb", textTransform: "uppercase" },
  muted: { color: "#666666" },
  error: { color: "#b42318", fontWeight: "600" },
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  apiHint: { fontSize: 12, color: "#5c5c6b", fontStyle: "italic", marginBottom: 4 },
  paragraph: { fontSize: 14, lineHeight: 21, color: "#2a2a33" }
});
