import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { fetchNumerologyDataset } from "../services/numerologyDataService";

export type MatrixDatasetsBundle = {
  baseNumberData: unknown;
  centralMissionData: unknown;
  feminineLineData: unknown;
  masculineLineData: unknown;
  matrixMoneyLoveData: unknown;
  externalRelationsData: unknown;
  matrixRelationsHeartData: unknown;
};

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: MatrixDatasetsBundle }
  | { status: "error"; message: string };

const INITIAL: State = { status: "idle" };

export function useMatrixInterpretationDatasets(isActive: boolean, readingId: string) {
  const [state, setState] = useState<State>(INITIAL);
  const cacheRef = useRef<MatrixDatasetsBundle | null>(null);

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
        baseNumberData,
        centralMissionData,
        feminineLineData,
        masculineLineData,
        matrixMoneyLoveData,
        externalRelationsData,
        matrixRelationsHeartData
      ] = await Promise.all([
        fetchNumerologyDataset("baseNumberData"),
        fetchNumerologyDataset("centralMissionData"),
        fetchNumerologyDataset("feminineLineData"),
        fetchNumerologyDataset("masculineLineData"),
        fetchNumerologyDataset("matrixMoneyLoveData"),
        fetchNumerologyDataset("externalRelationsData"),
        fetchNumerologyDataset("matrixRelationsHeartData")
      ]);
      const bundle: MatrixDatasetsBundle = {
        baseNumberData,
        centralMissionData,
        feminineLineData,
        masculineLineData,
        matrixMoneyLoveData,
        externalRelationsData,
        matrixRelationsHeartData
      };
      cacheRef.current = bundle;
      setState({ status: "ready", data: bundle });
    } catch (requestError) {
      setState({
        status: "error",
        message: getApiErrorMessage(requestError, "Impossible de charger les textes Matrix")
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
