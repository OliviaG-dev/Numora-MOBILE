import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { fetchNumerologyDataset } from "../services/numerologyDataService";

export type BasiqueDatasetsBundle = {
  lifePathData: unknown;
  expressionData: unknown;
  soulUrgeData: unknown;
  personalityData: unknown;
  birthdayData: unknown;
  heartNumberPersonalData: unknown;
  realisationNumberData: unknown;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: BasiqueDatasetsBundle }
  | { status: "error"; message: string };

const INITIAL: State = { status: "idle" };

export function useBasiqueInterpretationDatasets(isActive: boolean, readingId: string) {
  const [state, setState] = useState<State>(INITIAL);
  const cacheRef = useRef<BasiqueDatasetsBundle | null>(null);

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
      const [
        lifePathData,
        expressionData,
        soulUrgeData,
        personalityData,
        birthdayData,
        heartNumberPersonalData,
        realisationNumberData
      ] = await Promise.all([
        fetchNumerologyDataset("lifePathData"),
        fetchNumerologyDataset("expressionData"),
        fetchNumerologyDataset("soulUrgeData"),
        fetchNumerologyDataset("personalityData"),
        fetchNumerologyDataset("birthdayData"),
        fetchNumerologyDataset("heartNumberPersonalData"),
        fetchNumerologyDataset("realisationNumberData")
      ]);
      const bundle: BasiqueDatasetsBundle = {
        lifePathData,
        expressionData,
        soulUrgeData,
        personalityData,
        birthdayData,
        heartNumberPersonalData,
        realisationNumberData
      };
      cacheRef.current = bundle;
      setState({ status: "ready", data: bundle });
    } catch (requestError) {
      setState({
        status: "error",
        message: getApiErrorMessage(requestError, "Impossible de charger les textes numérologiques")
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
