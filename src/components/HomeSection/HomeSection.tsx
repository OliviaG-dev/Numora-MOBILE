import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { colors, radii, spacing } from "../../styles/theme";

type HomeSectionProps = {
  onGoToCreate: () => void;
  onGoToNameAnalyzer: () => void;
  onGoToDateAnalyzer: () => void;
  onGoToDailyVibration: () => void;
  onGoToPlaceVibration: () => void;
  onGoToCompatibilityAnalyzer: () => void;
};

type AnalyzerCardProps = {
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
  variant?: "default" | "center";
};

function AnalyzerCard({ title, description, buttonLabel, onPress, variant = "default" }: AnalyzerCardProps) {
  return (
    <View style={[styles.card, variant === "center" && styles.cardCenter]}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      <Pressable
        style={[styles.analyzerButton, variant === "center" && styles.analyzerButtonCenter]}
        onPress={onPress}
      >
        <Text style={styles.analyzerButtonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

export function HomeSection({
  onGoToCreate,
  onGoToNameAnalyzer,
  onGoToDateAnalyzer,
  onGoToDailyVibration,
  onGoToPlaceVibration,
  onGoToCompatibilityAnalyzer
}: HomeSectionProps) {
  return (
    <View style={styles.content}>
      <View style={styles.titleRow}>
        <Image source={require("../../../assets/logo.png")} style={styles.logo} accessibilityLabel="Logo Numora" />
        <Text style={styles.title}>Numora</Text>
      </View>
      <Text style={styles.subtitle}>Chaque nombre raconte ton histoire.</Text>

      <View style={styles.vibrationRow}>
        <Pressable style={styles.vibrationButton} onPress={onGoToDailyVibration}>
          <Text style={styles.vibrationButtonText}>Vibration du Jour</Text>
        </Pressable>
        <Pressable style={styles.vibrationButton} onPress={onGoToPlaceVibration}>
          <Text style={styles.vibrationButtonText}>Vibration d'un lieu</Text>
        </Pressable>
      </View>

      <AnalyzerCard
        title="Analyse de Nom"
        description="Analyse le nom complet de ton entreprise ou projet pour révéler ses nombres d'expression, actif et héréditaire. Découvre les énergies et potentiels cachés de ton business."
        buttonLabel="Analyser un nom"
        onPress={onGoToNameAnalyzer}
      />

      <AnalyzerCard
        title="Découvre toi"
        description="Découvre comment les nombres de ta naissance révèlent tes talents, ton énergie et tes cycles de vie. Une application simple, moderne et claire pour mieux te comprendre et avancer sereinement."
        buttonLabel="Découvre toi"
        onPress={onGoToCreate}
        variant="center"
      />

      <AnalyzerCard
        title="Analyse de Date"
        description="Découvre l'énergie vibratoire d'une date précise (passée ou future) et ses influences. Analyse les opportunités et défis liés à cette date spécifique."
        buttonLabel="Analyser une date"
        onPress={onGoToDateAnalyzer}
      />

      <AnalyzerCard
        title="Compatibilité"
        description="Découvrez votre compatibilité numérologique avec une autre personne, que ce soit en amitié, en amour ou en collaboration professionnelle. Explorez les harmonies et défis de votre relation."
        buttonLabel="Analyser compatibilité"
        onPress={onGoToCompatibilityAnalyzer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    gap: spacing.md
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.sm
  },
  logo: {
    width: 52,
    height: 52,
    resizeMode: "contain"
  },
  title: {
    fontSize: 36,
    fontWeight: "700",
    color: colors.primaryPurpleLight
  },
  subtitle: {
    fontSize: 16,
    fontStyle: "italic",
    fontWeight: "500",
    color: colors.secondaryGold,
    textAlign: "center",
    marginBottom: spacing.xs
  },
  vibrationRow: {
    width: "100%",
    gap: spacing.sm,
    marginVertical: spacing.xs
  },
  vibrationButton: {
    backgroundColor: colors.purpleGlass,
    borderWidth: 1,
    borderColor: colors.purpleBorder,
    borderRadius: radii.pill,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: "center"
  },
  vibrationButtonText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase"
  },
  card: {
    width: "100%",
    maxWidth: 500,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: "center"
  },
  cardCenter: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "rgba(139, 92, 246, 0.25)",
    paddingVertical: spacing.lg
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primaryPurpleLight,
    textAlign: "center",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: spacing.sm
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#d1d5db",
    textAlign: "center",
    marginBottom: spacing.md
  },
  analyzerButton: {
    backgroundColor: colors.secondaryGold,
    borderRadius: radii.md,
    paddingVertical: 12,
    paddingHorizontal: spacing.lg,
    minWidth: 180,
    alignItems: "center",
    shadowColor: colors.secondaryGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4
  },
  analyzerButtonCenter: {
    minWidth: 200
  },
  analyzerButtonText: {
    color: colors.textOnGold,
    fontWeight: "700",
    fontSize: 14
  }
});
