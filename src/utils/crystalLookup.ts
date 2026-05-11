import type {
  CrystalExpressionEntry,
  CrystalPathEntry,
  CrystalSyntheseProfil,
  CrystalSyntheseWrapper
} from "../types/crystal.types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function findCrystalPathEntry(dataset: unknown, lifePath: number): CrystalPathEntry | null {
  if (!Array.isArray(dataset)) {
    return null;
  }

  const key = String(lifePath);
  const found = dataset.find(
    (item): item is CrystalPathEntry =>
      isRecord(item) && typeof item.chemin === "string" && item.chemin === key
  );
  return found ?? null;
}

export function findCrystalExpressionEntry(
  dataset: unknown,
  expression: number
): CrystalExpressionEntry | null {
  if (!Array.isArray(dataset)) {
    return null;
  }

  const key = String(expression);
  const found = dataset.find(
    (item): item is CrystalExpressionEntry =>
      isRecord(item) &&
      typeof item.nombre_expression === "string" &&
      item.nombre_expression === key
  );
  return found ?? null;
}

export function findCrystalSyntheseEntry(
  dataset: unknown,
  lifePath: number,
  expression: number
): CrystalSyntheseProfil | null {
  if (!Array.isArray(dataset)) {
    return null;
  }

  const wrapper = dataset.find((item): item is CrystalSyntheseWrapper => {
    if (!isRecord(item) || !isRecord(item.profil_synthese)) {
      return false;
    }
    const p = item.profil_synthese as Record<string, unknown>;
    return p.chemin_de_vie === lifePath && p.nombre_expression === expression;
  });

  return wrapper?.profil_synthese ?? null;
}
