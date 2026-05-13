import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { fetchNumerologyDataset } from "../services/numerologyDataService";

export type TreeDatasetsBundle = {
  sephirothData: unknown;
  sephirothNumberData: unknown;
  pathsData: unknown;
  pathsNumberData: unknown;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: TreeDatasetsBundle }
  | { status: "error"; message: string };

const INITIAL: State = { status: "idle" };

export function useTreeInterpretationDatasets(isActive: boolean, readingId: string) {
  const [state, setState] = useState<State>(INITIAL);
  const cacheRef = useRef<TreeDatasetsBundle | null>(null);

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
      const [sephirothData, sephirothNumberData, pathsData, pathsNumberData] = await Promise.all([
        fetchNumerologyDataset("sephirothData"),
        fetchNumerologyDataset("sephirothNumberData"),
        fetchNumerologyDataset("pathsData"),
        fetchNumerologyDataset("pathsNumberData")
      ]);
      const bundle: TreeDatasetsBundle = {
        sephirothData,
        sephirothNumberData,
        pathsData,
        pathsNumberData
      };
      cacheRef.current = bundle;
      setState({ status: "ready", data: bundle });
    } catch (requestError) {
      setState({
        status: "error",
        message: getApiErrorMessage(requestError, "Impossible de charger les textes Arbre de vie")
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
