import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCrystalProfile } from "../../hooks/useCrystalProfile";
import { CrystalProfile } from "../CrystalProfile/CrystalProfile";
import { ReadingBasiquesPanel } from "../ReadingBasiquesPanel/ReadingBasiquesPanel";
import { ReadingDatesPanel } from "../ReadingDatesPanel/ReadingDatesPanel";
import { ReadingKarmicPanel } from "../ReadingKarmicPanel/ReadingKarmicPanel";
import { RichObjectPayload } from "../RichObjectPayload/RichObjectPayload";

type ReadingDetailTabsProps = {
  readingId: string;
  results: Record<string, unknown>;
};

type TabId =
  | "basiques"
  | "dates"
  | "karmique"
  | "matrix"
  | "arbre"
  | "travail"
  | "lithotherapie";

const TABS: { id: TabId; label: string }[] = [
  { id: "basiques", label: "Basiques" },
  { id: "dates", label: "Dates" },
  { id: "karmique", label: "Karma" },
  { id: "matrix", label: "Matrix" },
  { id: "arbre", label: "Arbre" },
  { id: "travail", label: "Travail" },
  { id: "lithotherapie", label: "Cristaux" }
];

export function ReadingDetailTabs({ readingId, results }: ReadingDetailTabsProps) {
  const [activeTab, setActiveTab] = useState<TabId>("basiques");
  const { lifePath, expression } = useMemo(() => extractCoreNumbers(results), [results]);

  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
        {TABS.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            style={[styles.tab, activeTab === tab.id && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}>{tab.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.panel}>
        {activeTab === "basiques" ? (
          <ReadingBasiquesPanel
            readingId={readingId}
            core={results.core}
            place={results.place}
            isActive
          />
        ) : null}
        {activeTab === "dates" ? (
          <ReadingDatesPanel
            readingId={readingId}
            personal={results.personal}
            challenges={results.challenges}
            universalVibrations={results.universalVibrations}
            isActive
          />
        ) : null}
        {activeTab === "karmique" ? (
          <ReadingKarmicPanel readingId={readingId} karmic={results.karmic} isActive />
        ) : null}
        {activeTab === "matrix" ? (
          <RichObjectPayload title="Matrix Destiny" data={results.matrixDestiny} />
        ) : null}
        {activeTab === "arbre" ? <RichObjectPayload title="Arbre de vie" data={results.treeOfLife} /> : null}
        {activeTab === "travail" ? (
          <RichObjectPayload title="Travail & business" data={results.business} />
        ) : null}
        {activeTab === "lithotherapie" ? (
          lifePath !== null && expression !== null ? (
            <ReadingCrystalPanel lifePath={lifePath} expression={expression} />
          ) : (
            <Text style={styles.muted}>
              Les nombres du noyau (chemin de vie, expression) sont absents des résultats de cette lecture.
              Enregistrez une lecture complète via le calcul numérologique API pour afficher les cristaux.
            </Text>
          )
        ) : null}
      </View>
    </View>
  );
}

function ReadingCrystalPanel({ lifePath, expression }: { lifePath: number; expression: number }) {
  const crystal = useCrystalProfile(lifePath, expression);
  return (
    <CrystalProfile
      lifePath={lifePath}
      expression={expression}
      isLoading={crystal.isLoading}
      error={crystal.error}
      pathEntry={crystal.pathEntry}
      expressionEntry={crystal.expressionEntry}
      synthese={crystal.synthese}
    />
  );
}

function extractCoreNumbers(results: Record<string, unknown>): {
  lifePath: number | null;
  expression: number | null;
} {
  const core = results.core;
  if (typeof core !== "object" || core === null || Array.isArray(core)) {
    return { lifePath: null, expression: null };
  }
  const c = core as Record<string, unknown>;
  const lp = Number(c.lifePath);
  const ex = Number(c.expression);
  return {
    lifePath: Number.isFinite(lp) ? lp : null,
    expression: Number.isFinite(ex) ? ex : null
  };
}

const styles = StyleSheet.create({
  wrapper: { gap: 10 },
  tabBar: { flexDirection: "row", gap: 8, paddingVertical: 4 },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#e8e8ee",
    borderWidth: 1,
    borderColor: "transparent"
  },
  tabActive: {
    backgroundColor: "#eaf2ff",
    borderColor: "#1f6feb"
  },
  tabText: { fontWeight: "600", color: "#333333" },
  tabTextActive: { color: "#1f6feb" },
  panel: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ececf3",
    minHeight: 120
  },
  muted: { color: "#666666" }
});
