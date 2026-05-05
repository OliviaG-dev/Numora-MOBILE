import { useCallback, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { calculateNumerology } from "../services/numerologyService";
import type { NumerologyCalculatePayload, NumerologyResult } from "../types/numerology.types";

export function useNumerology() {
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback(async (payload: NumerologyCalculatePayload) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await calculateNumerology(payload);
      setResult(response.result);
      return response.result;
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to calculate numerology");
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    result,
    isLoading,
    error,
    calculate
  };
}
