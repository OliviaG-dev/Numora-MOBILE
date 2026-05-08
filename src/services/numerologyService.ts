import { apiClient } from "./apiClient";
import type {
  NumerologyCalculatePayload,
  NumerologyCalculateResponse
} from "../types/numerology.types";

export async function calculateNumerology(
  payload: NumerologyCalculatePayload
): Promise<NumerologyCalculateResponse> {
  const response = await apiClient.post<NumerologyCalculateResponse>(
    "/numerology/calculate",
    payload
  );
  return response.data;
}
