import { useMemo, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { CrystalProfile } from "../../components/CrystalProfile/CrystalProfile";
import { EuropeanDateInput } from "../../components/EuropeanDateInput/EuropeanDateInput";
import { useCrystalProfile } from "../../hooks/useCrystalProfile";
import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import { EU_DATE_FORMAT_LABEL, parseDateInputToIso } from "../../utils/europeanDate";

export function Crystals() {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [lifePath, setLifePath] = useState<number | null>(null);
  const [expression, setExpression] = useState<number | null>(null);
  const [numerologyError, setNumerologyError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const crystal = useCrystalProfile(lifePath, expression);

  const numbersReady = lifePath !== null && expression !== null;
  const canSubmit = fullName.trim() && birthDate.trim() && !isCalculating;

  const handleCalculate = async () => {
    setNumerologyError(null);
    setIsCalculating(true);
    setLifePath(null);
    setExpression(null);
    const birthDateIso = parseDateInputToIso(birthDate);
    if (!birthDateIso) {
      setNumerologyError(`Date de naissance invalide (${EU_DATE_FORMAT_LABEL}).`);
      setIsCalculating(false);
      return;
    }
    try {
      const response = await calculateNumerology({
        fullName: fullName.trim(),
        birthDate: birthDateIso
      });
      const core = response.result.core as Record<string, unknown>;
      const lp = Number(core.lifePath);
      const ex = Number(core.expression);
      if (!Number.isFinite(lp) || !Number.isFinite(ex)) {
        setNumerologyError("Réponse API : nombres du noyau manquants.");
        return;
      }
      setLifePath(lp);
      setExpression(ex);
    } catch (requestError) {
      setNumerologyError(getApiErrorMessage(requestError, "Impossible de calculer la numérologie"));
    } finally {
      setIsCalculating(false);
    }
  };

  const headerSubtitle = useMemo(() => {
    if (!numbersReady) {
      return "Saisis le nom complet et la date de naissance, puis lance le calcul pour afficher les cristaux alignés avec le web Numora.";
    }
    return null;
  }, [numbersReady]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cristaux & lithothérapie</Text>
        {headerSubtitle ? <Text style={styles.subtitle}>{headerSubtitle}</Text> : null}

        <TextInput
          placeholder="Nom complet"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <EuropeanDateInput value={birthDate} onChangeText={setBirthDate} inputStyle={styles.input} />

        {numerologyError ? <Text style={styles.error}>{numerologyError}</Text> : null}

        <Pressable
          style={[styles.button, !canSubmit && styles.buttonDisabled]}
          disabled={!canSubmit}
          onPress={() => void handleCalculate()}
        >
          <Text style={styles.buttonText}>{isCalculating ? "Calcul…" : "Calculer les cristaux"}</Text>
        </Pressable>

        {numbersReady ? (
          <CrystalProfile
            lifePath={lifePath}
            expression={expression}
            isLoading={crystal.isLoading}
            error={crystal.error}
            pathEntry={crystal.pathEntry}
            expressionEntry={crystal.expressionEntry}
            synthese={crystal.synthese}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f6f7fb" },
  container: { padding: 16, gap: 10, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: "800" },
  subtitle: { color: "#5f5f5f" },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  },
  button: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center"
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#ffffff", fontWeight: "700" },
  error: { color: "#d1242f", fontWeight: "600" }
});
