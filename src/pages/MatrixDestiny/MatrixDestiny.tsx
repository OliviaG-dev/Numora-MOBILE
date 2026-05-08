import { useState } from "react";
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { getApiErrorMessage } from "../../services/apiClient";
import { calculateNumerology } from "../../services/numerologyService";

type MatrixDestinyProps = {
  initialMatrix: unknown;
};

export function MatrixDestiny({ initialMatrix }: MatrixDestinyProps) {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [matrix, setMatrix] = useState<unknown>(initialMatrix);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const response = await calculateNumerology({
        fullName: fullName.trim(),
        birthDate: birthDate.trim()
      });
      setMatrix(response.result.matrixDestiny);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to calculate Matrix Destiny"));
    } finally {
      setIsLoading(false);
    }
  };

  const sections = toSections(matrix);
  const isDisabled = isLoading || !fullName.trim() || !birthDate.trim();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Matrix Destiny</Text>
        <Text style={styles.subtitle}>Calculate and inspect your matrix from birth data.</Text>

        <TextInput
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
          style={styles.input}
        />
        <TextInput
          placeholder="Birth date (YYYY-MM-DD)"
          value={birthDate}
          onChangeText={setBirthDate}
          style={styles.input}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={() => void handleCalculate()}
          disabled={isDisabled}
          style={[styles.button, isDisabled && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{isLoading ? "Calculating..." : "Calculate matrix"}</Text>
        </Pressable>

        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Result</Text>
          {sections.length ? (
            sections.map((section) => (
              <View key={section.key} style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>{section.label}</Text>
                {section.lines.map((line) => (
                  <Text key={line.key} style={styles.line}>
                    {line.label}: {line.value}
                  </Text>
                ))}
              </View>
            ))
          ) : (
            <Text style={styles.line}>No matrix data yet. Run a calculation first.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SectionLine = {
  key: string;
  label: string;
  value: string;
};

type Section = {
  key: string;
  label: string;
  lines: SectionLine[];
};

function toSections(value: unknown): Section[] {
  if (!isPlainRecord(value)) {
    return [];
  }

  return Object.entries(value).map(([sectionKey, sectionValue]) => {
    if (!isPlainRecord(sectionValue)) {
      return {
        key: sectionKey,
        label: formatLabel(sectionKey),
        lines: [{ key: `${sectionKey}-value`, label: "Value", value: formatValue(sectionValue) }]
      };
    }

    const lines = flattenRecord(sectionKey, sectionValue);
    return {
      key: sectionKey,
      label: formatLabel(sectionKey),
      lines
    };
  });
}

function flattenRecord(prefix: string, value: Record<string, unknown>): SectionLine[] {
  return Object.entries(value).flatMap(([key, item]) => {
    if (isPlainRecord(item)) {
      return Object.entries(item).map(([childKey, childValue]) => ({
        key: `${prefix}-${key}-${childKey}`,
        label: `${formatLabel(key)} / ${formatLabel(childKey)}`,
        value: formatValue(childValue)
      }));
    }

    return [
      {
        key: `${prefix}-${key}`,
        label: formatLabel(key),
        value: formatValue(item)
      }
    ];
  });
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

function formatLabel(raw: string): string {
  if (!raw) {
    return raw;
  }

  const normalized = raw
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();

  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6f7fb"
  },
  container: {
    padding: 16,
    gap: 10,
    paddingBottom: 32
  },
  title: {
    fontSize: 24,
    fontWeight: "800"
  },
  subtitle: {
    color: "#5f5f5f"
  },
  input: {
    borderWidth: 1,
    borderColor: "#d8d8d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#ffffff"
  },
  button: {
    marginTop: 4,
    backgroundColor: "#1f6feb",
    borderRadius: 8,
    alignItems: "center",
    paddingVertical: 12
  },
  buttonDisabled: {
    opacity: 0.5
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700"
  },
  error: {
    color: "#d1242f",
    fontWeight: "600"
  },
  resultCard: {
    marginTop: 8,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    gap: 8
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "700"
  },
  sectionBlock: {
    borderTopWidth: 1,
    borderTopColor: "#efefef",
    paddingTop: 8,
    gap: 4
  },
  sectionTitle: {
    fontWeight: "700",
    color: "#212121"
  },
  line: {
    color: "#333333"
  }
});
