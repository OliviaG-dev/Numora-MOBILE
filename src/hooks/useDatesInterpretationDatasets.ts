import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { fetchNumerologyDataset } from "../services/numerologyDataService";

export type DatesDatasetsBundle = {
  personelCycleData: unknown;
  lifeCycleData: unknown;
  realizationPeriodData: unknown;
  dateVibeData: unknown;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: DatesDatasetsBundle }
  | { status: "error"; message: string };

const INITIAL: State = { status: "idle" };

export function useDatesInterpretationDatasets(isActive: boolean, readingId: string) {
  const [state, setState] = useState<State>(INITIAL);
  const cacheRef = useRef<DatesDatasetsBundle | null>(null);

  useEffect(() => {
    cacheRef.current = null;
    setState(INITIAL);
  }, [readingId]);

  const load = useCallback(async () => {
    if (cacheRef.current) {
      setState({ status: "ready", data: cacheRef.current });
      return;
    }
    setState({ status: "loading" });
    try {
      const [personelCycleData, lifeCycleData, realizationPeriodData, dateVibeData] = await Promise.all([
        fetchNumerologyDataset("personelCycleData"),
        fetchNumerologyDataset("lifeCycleData"),
        fetchNumerologyDataset("realizationPeriodData"),
        fetchNumerologyDataset("dateVibeData")
      ]);
      const bundle: DatesDatasetsBundle = {
        personelCycleData,
        lifeCycleData,
        realizationPeriodData,
        dateVibeData
      };
      cacheRef.current = bundle;
      setState({ status: "ready", data: bundle });
    } catch (requestError) {
      setState({
        status: "error",
        message: getApiErrorMessage(requestError, "Impossible de charger les textes des dates")
      });
    }
  }, [readingId]);

  useEffect(() => {
    if (!isActive) {
      return;
    }
    void load();
  }, [isActive, load, readingId]);

  const reload = useCallback(async () => {
    cacheRef.current = null;
    await load();
  }, [load]);

  return { state, reload };
}
