import { StyleSheet, Text, View } from "react-native";

import type { CrystalExpressionEntry, CrystalPathEntry, CrystalSyntheseProfil } from "../../types/crystal.types";

type CrystalProfileProps = {
  lifePath: number;
  expression: number;
  isLoading: boolean;
  error: string | null;
  pathEntry: CrystalPathEntry | null;
  expressionEntry: CrystalExpressionEntry | null;
  synthese: CrystalSyntheseProfil | null;
};

export function CrystalProfile({
  lifePath,
  expression,
  isLoading,
  error,
  pathEntry,
  expressionEntry,
  synthese
}: CrystalProfileProps) {
  if (isLoading) {
    return <Text style={styles.muted}>Chargement des cristaux…</Text>;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.intro}>
        Chemin de vie {lifePath} · Expression {expression}
      </Text>

      {pathEntry ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cristaux — Chemin de vie {pathEntry.chemin}</Text>
          <Text style={styles.description}>{pathEntry.description}</Text>
          <CrystalBloc title="Amour" pierre={pathEntry.pierres.amour} />
          <CrystalBloc title="Carrière" pierre={pathEntry.pierres.carriere} />
          <CrystalBloc title="Spiritualité" pierre={pathEntry.pierres.spiritualite} />
        </View>
      ) : (
        <Text style={styles.muted}>Aucune donnée cristaux pour ce chemin de vie.</Text>
      )}

      {expressionEntry ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cristal — Expression {expressionEntry.nombre_expression}</Text>
          <Text style={styles.description}>{expressionEntry.description}</Text>
          <CrystalBloc title="Pierre prioritaire" pierre={expressionEntry.pierre} />
        </View>
      ) : (
        <Text style={styles.muted}>Aucune donnée cristaux pour ce nombre d&apos;expression.</Text>
      )}

      {synthese?.synthese ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Synthèse cristalline</Text>
          <Text style={styles.line}>
            <Text style={styles.bold}>Énergie dominante : </Text>
            {synthese.synthese.energie_dominante}
          </Text>
          <Text style={styles.line}>
            <Text style={styles.bold}>Objectif global : </Text>
            {synthese.synthese.objectif_global}
          </Text>
          <CrystalBloc title="Pierre prioritaire" pierre={synthese.synthese.pierre_prioritaire} />
          <Text style={styles.message}>{synthese.synthese.message_cle}</Text>
        </View>
      ) : (
        <Text style={styles.muted}>Aucune synthèse pour cette combinaison.</Text>
      )}
    </View>
  );
}

function CrystalBloc({
  title,
  pierre
}: {
  title: string;
  pierre: { nom: string; proprietes?: string; energie?: string; objectif?: string };
}) {
  return (
    <View style={styles.bloc}>
      <Text style={styles.blocTitle}>{title} — {pierre.nom}</Text>
      {pierre.proprietes ? <Text style={styles.line}>{pierre.proprietes}</Text> : null}
      {pierre.energie ? <Text style={styles.line}>{pierre.energie}</Text> : null}
      {pierre.objectif ? <Text style={styles.line}>{pierre.objectif}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  intro: { color: "#454545", fontWeight: "600" },
  muted: { color: "#666666" },
  error: { color: "#d1242f", fontWeight: "600" },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: "#ececf3"
  },
  cardTitle: { fontSize: 17, fontWeight: "800", color: "#1a1a1a" },
  description: { color: "#333333", marginBottom: 4 },
  bloc: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    gap: 4
  },
  blocTitle: { fontWeight: "700", color: "#1f6feb" },
  line: { color: "#333333" },
  bold: { fontWeight: "700" },
  message: {
    marginTop: 6,
    fontStyle: "italic",
    color: "#444444"
  }
});
