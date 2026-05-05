import { useCallback, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import {
  createReading,
  deleteReading,
  getReadingById,
  listReadings
} from "../services/readingService";
import type { CreateReadingPayload, Reading } from "../types/reading.types";

export function useReadings() {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshReadings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await listReadings();
      setReadings(response.readings);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load readings"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReading = useCallback(async (payload: CreateReadingPayload) => {
    setError(null);
    try {
      const response = await createReading(payload);
      setReadings((current) => [response.reading, ...current]);
      return response.reading;
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to create reading");
      setError(message);
      throw new Error(message);
    }
  }, []);

  const loadReadingById = useCallback(async (readingId: string) => {
    const response = await getReadingById(readingId);
    return response.reading;
  }, []);

  const removeReading = useCallback(async (readingId: string) => {
    setError(null);
    try {
      await deleteReading(readingId);
      setReadings((current) => current.filter((reading) => reading.id !== readingId));
    } catch (requestError) {
      const message = getApiErrorMessage(requestError, "Unable to delete reading");
      setError(message);
      throw new Error(message);
    }
  }, []);

  return {
    readings,
    isLoading,
    error,
    refreshReadings,
    addReading,
    loadReadingById,
    removeReading
  };
}
