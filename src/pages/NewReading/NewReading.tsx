import { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";
import type { NumerologyCalculatePayload } from "../../types/numerology.types";
import {
  READING_CATEGORIES,
  type CreateReadingPayload,
  type Reading,
  type ReadingCategory
} from "../../types/reading.types";
import { numerologyResultToReadingResults } from "../../utils/numerologyResultToReadingResults";

const CATEGORY_LABELS: Record<ReadingCategory, string> = {
  "life-path": "Chemin de vie",
  compatibility: "Compatibilité",
  forecast: "Prévisions",
  custom: "Personnalisé"
};

type NewReadingProps = {
  onCreateReading: (payload: CreateReadingPayload) => Promise<Reading>;
  onCancel: () => void;
  onCreated: (readingId: string) => void;
};

function joinTrimmedParts(parts: Array<string | undefined>): string {
  return parts
    .map((p) => p?.trim())
    .filter((p): p is string => Boolean(p && p.length > 0))
    .join(" ");
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value.trim())) {
    return false;
  }
  const d = new Date(`${value.trim()}T12:00:00.000Z`);
  return !Number.isNaN(d.getTime());
}

export function NewReading({ onCreateReading, onCancel, onCreated }: NewReadingProps) {
  const [readingTitle, setReadingTitle] = useState("");
  const [firstGivenName, setFirstGivenName] = useState("");
  const [secondGivenName, setSecondGivenName] = useState("");
  const [thirdGivenName, setThirdGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [category, setCategory] = useState<ReadingCategory>("life-path");

  const [referenceDate, setReferenceDate] = useState("");
  const [streetNumber, setStreetNumber] = useState("");
  const [streetName, setStreetName] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildNumerologyPayload = (): NumerologyCalculatePayload => {
    const fullName = joinTrimmedParts([
      firstGivenName,
      secondGivenName,
      thirdGivenName,
      familyName
    ]);
    return {
      fullName,
      birthDate: birthDate.trim(),
      referenceDate: referenceDate.trim() || undefined,
      address:
        streetNumber.trim() && streetName.trim()
          ? { streetNumber: streetNumber.trim(), streetName: streetName.trim() }
          : undefined,
      locality:
        postalCode.trim() && city.trim()
          ? { postalCode: postalCode.trim(), city: city.trim() }
          : undefined
    };
  };

  const validate = (): string | null => {
    if (!firstGivenName.trim()) {
      return "Le premier prénom est obligatoire.";
    }
    if (!familyName.trim()) {
      return "Le nom de famille est obligatoire.";
    }
    if (!birthDate.trim()) {
      return "La date de naissance est obligatoire (AAAA-MM-JJ).";
    }
    if (!isValidIsoDate(birthDate)) {
      return "La date de naissance doit être au format AAAA-MM-JJ valide.";
    }
    if (referenceDate.trim() && !isValidIsoDate(referenceDate)) {
      return "La date de référence doit être au format AAAA-MM-JJ valide.";
    }
    return null;
  };

  const handleSubmit = async () => {
    setError(null);
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const numerologyPayload = buildNumerologyPayload();
      const { result } = await calculateNumerology(numerologyPayload);

      const results = numerologyResultToReadingResults(result);
      if (readingTitle.trim()) {
        results.readingTitle = readingTitle.trim();
      }

      const firstName = joinTrimmedParts([firstGivenName, secondGivenName, thirdGivenName]);
      const payload: CreateReadingPayload = {
        firstName,
        lastName: familyName.trim(),
        birthDate: birthDate.trim(),
        category,
        results
      };

      const reading = await onCreateReading(payload);
      onCreated(reading.id);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Impossible d’enregistrer la lecture"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Nouvelle lecture</Text>
        <Text style={styles.hint}>
          Saisis les informations de naissance : le calcul numérologique est fait automatiquement, puis la lecture
          est enregistrée.
        </Text>

        <Text style={styles.sectionLabel}>Nom de la lecture (optionnel)</Text>
        <TextInput
          placeholder="Ex. Analyse personnelle"
          value={readingTitle}
          onChangeText={setReadingTitle}
          style={styles.input}
        />

        <Text style={styles.sectionLabel}>Prénom *</Text>
        <TextInput
          placeholder="Premier prénom"
          value={firstGivenName}
          onChangeText={setFirstGivenName}
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.sectionLabel}>Autres prénoms (optionnel)</Text>
        <TextInput
          placeholder="Deuxième prénom"
          value={secondGivenName}
          onChangeText={setSecondGivenName}
          style={styles.input}
          autoCapitalize="words"
        />
        <TextInput
          placeholder="Troisième prénom"
          value={thirdGivenName}
          onChangeText={setThirdGivenName}
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.sectionLabel}>Nom de famille *</Text>
        <TextInput
          placeholder="Nom de famille"
          value={familyName}
          onChangeText={setFamilyName}
          style={styles.input}
          autoCapitalize="words"
        />

        <Text style={styles.sectionLabel}>Date de naissance * (AAAA-MM-JJ)</Text>
        <TextInput
          placeholder="1990-05-14"
          value={birthDate}
          onChangeText={setBirthDate}
          style={styles.input}
          keyboardType="numbers-and-punctuation"
        />

        <Text style={styles.sectionLabel}>Catégorie</Text>
        <View style={styles.categoryRow}>
          {READING_CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={[styles.categoryChip, category === cat && styles.categoryChipActive]}
            >
              <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextActive]}>
                {CATEGORY_LABELS[cat]}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Options de calcul (optionnel)</Text>
        <TextInput
          placeholder="Date de référence (AAAA-MM-JJ)"
          value={referenceDate}
          onChangeText={setReferenceDate}
          style={styles.input}
          keyboardType="numbers-and-punctuation"
        />
        <Text style={styles.subSection}>Adresse</Text>
        <TextInput
          placeholder="Numéro de rue"
          value={streetNumber}
          onChangeText={setStreetNumber}
          style={styles.input}
        />
        <TextInput
          placeholder="Nom de rue"
          value={streetName}
          onChangeText={setStreetName}
          style={styles.input}
        />
        <Text style={styles.subSection}>Localité</Text>
        <TextInput
          placeholder="Code postal"
          value={postalCode}
          onChangeText={setPostalCode}
          style={styles.input}
        />
        <TextInput placeholder="Ville" value={city} onChangeText={setCity} style={styles.input} />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.actions}>
          <Pressable
            style={[styles.primaryButton, submitting && styles.buttonDisabled]}
            disabled={submitting}
            onPress={() => void handleSubmit()}
          >
            <Text style={styles.primaryText}>
              {submitting ? "Calcul et enregistrement…" : "Calculer et enregistrer"}
            </Text>
          </Pressable>
          <Pressable style={styles.secondaryButton} disabled={submitting} onPress={onCancel}>
            <Text style={styles.secondaryText}>Annuler</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
    gap: 8
  },
  title: {
    fontSize: 24,
    fontWeight: "800"
  },
  hint: {
    color: "#5f5f5f",
    marginBottom: 8,
    lineHeight: 20
  },
  sectionLabel: {
    marginTop: 8,
    fontWeight: "700",
    color: "#333333"
  },
  subSection: {
    marginTop: 4,
    fontWeight: "600",
    color: "#4d4d4d"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4
  },
  categoryChip: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#ffffff"
  },
  categoryChipActive: {
    backgroundColor: "#1f6feb",
    borderColor: "#1f6feb"
  },
  categoryChipText: {
    color: "#333333",
    fontWeight: "600",
    fontSize: 13
  },
  categoryChipTextActive: {
    color: "#ffffff"
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    flexWrap: "wrap"
  },
  primaryButton: {
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  buttonDisabled: {
    opacity: 0.5
  },
  primaryText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "#222222",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12
  },
  secondaryText: {
    color: "#222222",
    fontWeight: "700"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600",
    marginTop: 8
  }
});
