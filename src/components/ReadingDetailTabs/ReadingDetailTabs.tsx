import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { useCrystalProfile } from "../../hooks/useCrystalProfile";
import { buildStructuredSections } from "../../utils/structuredPayload";
import { CrystalProfile } from "../CrystalProfile/CrystalProfile";

type ReadingDetailTabsProps = {
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

export function ReadingDetailTabs({ results }: ReadingDetailTabsProps) {
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
          <TabSections
            sections={[
              { title: "Noyau (core)", data: results.core },
              { title: "Lieu", data: results.place, optional: true }
            ]}
          />
        ) : null}
        {activeTab === "dates" ? (
          <TabSections
            sections={[
              { title: "Nombres personnels", data: results.personal },
              { title: "Cycles & défis", data: results.challenges },
              { title: "Vibrations universelles", data: results.universalVibrations, optional: true }
            ]}
          />
        ) : null}
        {activeTab === "karmique" ? <SinglePayload title="Karmique" data={results.karmic} /> : null}
        {activeTab === "matrix" ? <SinglePayload title="Matrix Destiny" data={results.matrixDestiny} /> : null}
        {activeTab === "arbre" ? <SinglePayload title="Arbre de vie" data={results.treeOfLife} /> : null}
        {activeTab === "travail" ? <SinglePayload title="Travail & business" data={results.business} /> : null}
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

function TabSections({
  sections
}: {
  sections: { title: string; data: unknown; optional?: boolean }[];
}) {
  const hasAny = sections.some(
    (s) => !(s.optional && (s.data === undefined || s.data === null)) && s.data !== undefined && s.data !== null
  );
  if (!hasAny) {
    return <Text style={styles.muted}>Aucune donnée pour cet onglet.</Text>;
  }

  return (
    <View style={styles.gap}>
      {sections.map((section) => {
        if (section.optional && (section.data === undefined || section.data === null)) {
          return null;
        }
        if (section.data === undefined || section.data === null) {
          return (
            <View key={section.title} style={styles.block}>
              <Text style={styles.blockTitle}>{section.title}</Text>
              <Text style={styles.muted}>Non disponible.</Text>
            </View>
          );
        }
        return <SinglePayload key={section.title} title={section.title} data={section.data} />;
      })}
    </View>
  );
}

function SinglePayload({ title, data }: { title: string; data: unknown }) {
  const sections = buildStructuredSections(data);
  if (!sections.length) {
    return (
      <View style={styles.block}>
        <Text style={styles.blockTitle}>{title}</Text>
        <Text style={styles.muted}>Aucune donnée structurée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.block}>
      <Text style={styles.blockTitle}>{title}</Text>
      {sections.map((sec) => (
        <View key={sec.key} style={styles.section}>
          <Text style={styles.sectionTitle}>{sec.label}</Text>
          {sec.lines.map((line) => (
            <Text key={line.key} style={styles.line}>
              {line.label}: {line.value}
            </Text>
          ))}
        </View>
      ))}
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
  gap: { gap: 14 },
  block: { gap: 8 },
  blockTitle: { fontSize: 16, fontWeight: "800", color: "#1a1a1a" },
  section: {
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    paddingTop: 8,
    gap: 4
  },
  sectionTitle: { fontWeight: "700", color: "#212121" },
  line: { color: "#333333" },
  muted: { color: "#666666" }
});
