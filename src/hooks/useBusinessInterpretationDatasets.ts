import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { fetchNumerologyDataset } from "../services/numerologyDataService";

export type BusinessDatasetsBundle = {
  expressionBusinessData: unknown;
  actifBusinessData: unknown;
  hereditaryBusinessData: unknown;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: BusinessDatasetsBundle }
  | { status: "error"; message: string };

const INITIAL: State = { status: "idle" };

export function useBusinessInterpretationDatasets(isActive: boolean, readingId: string) {
  const [state, setState] = useState<State>(INITIAL);
  const cacheRef = useRef<BusinessDatasetsBundle | null>(null);

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
      const [expressionBusinessData, actifBusinessData, hereditaryBusinessData] = await Promise.all([
        fetchNumerologyDataset("expressionBusinessData"),
        fetchNumerologyDataset("actifBusinessData"),
        fetchNumerologyDataset("hereditaryBusinessData")
      ]);
      const bundle: BusinessDatasetsBundle = {
        expressionBusinessData,
        actifBusinessData,
        hereditaryBusinessData
      };
      cacheRef.current = bundle;
      setState({ status: "ready", data: bundle });
    } catch (requestError) {
      setState({
        status: "error",
        message: getApiErrorMessage(requestError, "Impossible de charger les textes Travail")
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
