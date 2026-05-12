import { isPlainObjectRecord } from "./structuredPayload";

export function toFiniteInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

export function pickDatasetEntryByNumber(
  dataset: unknown,
  numberValue: number | null
): unknown {
  if (numberValue === null) {
    return null;
  }
  if (!isPlainObjectRecord(dataset)) {
    return null;
  }
  return dataset[String(numberValue)] ?? null;
}

export function pickRealisationEntry(dataset: unknown, numberValue: number | null): unknown {
  if (numberValue === null) {
    return null;
  }
  if (!isPlainObjectRecord(dataset)) {
    return null;
  }
  const nested = dataset.realisation_numbers;
  if (!isPlainObjectRecord(nested)) {
    return null;
  }
  return nested[String(numberValue)] ?? null;
}
