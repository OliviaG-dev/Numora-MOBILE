import { isPlainObjectRecord } from "./structuredPayload";
import { toFiniteInt } from "./numerologyInterpretationPick";

function reduceToMatrixNumber(value: number): number {
  let n = value;
  while (n > 22) {
    n = String(n)
      .split("")
      .reduce((acc, digit) => acc + Number(digit), 0);
  }
  return n === 0 ? 22 : n;
}

/**
 * Même logique que le web (calculateHeartLine) mais à partir du JSON API
 * (`parents.primary`, `talentZone.primary`, `center.maleLine.mission`).
 */
export function computeMatrixHeartLineFromApi(matrix: unknown): {
  physique: number;
  energy: number;
  emotions: number;
} | null {
  if (!isPlainObjectRecord(matrix)) {
    return null;
  }
  const center = matrix.center;
  const karmicLines = matrix.karmicLines;
  if (!isPlainObjectRecord(center) || !isPlainObjectRecord(karmicLines)) {
    return null;
  }
  const maleLine = center.maleLine;
  const parents = karmicLines.parents;
  const talentZone = karmicLines.talentZone;
  if (!isPlainObjectRecord(maleLine) || !isPlainObjectRecord(parents) || !isPlainObjectRecord(talentZone)) {
    return null;
  }
  const parentsPrimary = toFiniteInt(parents.primary);
  const talentPrimary = toFiniteInt(talentZone.primary);
  const maleMission = toFiniteInt(maleLine.mission);
  if (parentsPrimary === null || talentPrimary === null || maleMission === null) {
    return null;
  }
  const physique = reduceToMatrixNumber(parentsPrimary + maleMission);
  const energy = reduceToMatrixNumber(maleMission + talentPrimary);
  const emotions = reduceToMatrixNumber(physique + energy);
  return { physique, energy, emotions };
}
