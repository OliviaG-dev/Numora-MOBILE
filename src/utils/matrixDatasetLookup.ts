import { isPlainObjectRecord } from "./structuredPayload";
import {
  pickDatasetEntryByNumber,
  toFiniteInt,
} from "./numerologyInterpretationPick";

export function pickBaseNumberEntry(
  baseNumberData: unknown,
  category: "jour" | "mois" | "annee" | "mission_vie",
  numberValue: number | null,
): unknown {
  if (numberValue === null || !isPlainObjectRecord(baseNumberData)) {
    return null;
  }
  const slice = baseNumberData[category];
  return pickDatasetEntryByNumber(slice, numberValue);
}

export function pickCentralMissionEntry(
  centralMissionData: unknown,
  numberValue: number | null,
): unknown {
  if (numberValue === null || !isPlainObjectRecord(centralMissionData)) {
    return null;
  }
  const balance = centralMissionData.central_balance;
  return pickDatasetEntryByNumber(balance, numberValue);
}

export function pickMasculineLineEntry(
  masculineLineData: unknown,
  aspect: "spirit" | "heart" | "energy",
  numberValue: number | null,
): unknown {
  if (numberValue === null || !isPlainObjectRecord(masculineLineData)) {
    return null;
  }
  const line = masculineLineData.masculine_line;
  if (!isPlainObjectRecord(line)) {
    return null;
  }
  const bucket = line[aspect];
  return pickDatasetEntryByNumber(bucket, numberValue);
}

export function pickFeminineLineEntry(
  feminineLineData: unknown,
  aspect: "spirit" | "heart" | "energy",
  numberValue: number | null,
): unknown {
  if (numberValue === null || !isPlainObjectRecord(feminineLineData)) {
    return null;
  }
  const line = feminineLineData.feminine_line;
  if (!isPlainObjectRecord(line)) {
    return null;
  }
  const bucket = line[aspect];
  return pickDatasetEntryByNumber(bucket, numberValue);
}

export function pickMatrixMoneyLoveText(
  matrixMoneyLoveData: unknown,
  category: "love" | "money" | "pivot",
  numberValue: number | null,
): string | null {
  if (numberValue === null || !isPlainObjectRecord(matrixMoneyLoveData)) {
    return null;
  }
  const bucket = matrixMoneyLoveData[category];
  if (!isPlainObjectRecord(bucket)) {
    return null;
  }
  const raw = bucket[String(numberValue)];
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export function pickExternalRelationText(
  externalRelationsData: unknown,
  type: "pouvoir_social" | "influence_social",
  numberValue: number | null,
): string | null {
  if (numberValue === null || !isPlainObjectRecord(externalRelationsData)) {
    return null;
  }
  const bucket = externalRelationsData[type];
  if (!isPlainObjectRecord(bucket)) {
    return null;
  }
  const raw = bucket[String(numberValue)];
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export function pickRelationHeartText(
  matrixRelationsHeartData: unknown,
  kind: "interior" | "exterior",
  numberValue: number | null,
): string | null {
  if (numberValue === null || !isPlainObjectRecord(matrixRelationsHeartData)) {
    return null;
  }
  const bucket = matrixRelationsHeartData[kind];
  if (!isPlainObjectRecord(bucket)) {
    return null;
  }
  const raw = bucket[String(numberValue)];
  return typeof raw === "string" && raw.trim() ? raw.trim() : null;
}

export function readMatrixNumber(obj: unknown, key: string): number | null {
  if (!isPlainObjectRecord(obj)) {
    return null;
  }
  return toFiniteInt(obj[key]);
}
