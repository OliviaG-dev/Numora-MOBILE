import { isPlainObjectRecord } from "./structuredPayload";

/**
 * Aligné sur le web : essaie `from_to` puis `to_from` selon la présence dans pathsNumberData.
 */
export function createPathKey(from: string, to: string, pathsNumberData: unknown): string {
  const fromLower = from.toLowerCase();
  const toLower = to.toLowerCase();
  const directKey = `${fromLower}_${toLower}`;
  const reverseKey = `${toLower}_${fromLower}`;

  if (isPlainObjectRecord(pathsNumberData)) {
    if (pathsNumberData[directKey] !== undefined) {
      return directKey;
    }
    if (pathsNumberData[reverseKey] !== undefined) {
      return reverseKey;
    }
  }

  return fromLower < toLower ? directKey : reverseKey;
}
