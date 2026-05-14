import type { NumerologyResult } from "../types/numerology.types";

/**
 * Maps an API numerology result into the `results` object expected by reading detail tabs.
 */
export function numerologyResultToReadingResults(result: NumerologyResult): Record<string, unknown> {
  return {
    identity: result.identity,
    core: result.core,
    personal: result.personal,
    challenges: result.challenges,
    karmic: result.karmic,
    matrixDestiny: result.matrixDestiny,
    treeOfLife: result.treeOfLife,
    universalVibrations: result.universalVibrations,
    business: result.business,
    place: result.place
  };
}
