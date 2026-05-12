import { useCallback, useEffect, useRef, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { fetchNumerologyDataset } from "../services/numerologyDataService";

type State =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; data: unknown }
  | { status: "error"; message: string };

const INITIAL: State = { status: "idle" };

export function useKarmicDebtsDataset(isActive: boolean, needsDebtCopy: boolean, readingId: string) {
  const [state, setState] = useState<State>(INITIAL);
  const cacheRef = useRef<unknown | null>(null);

  useEffect(() => {
    cacheRef.current = null;
    setState(INITIAL);
  }, [readingId]);

  const load = useCallback(async () => {
    if (!needsDebtCopy) {
      return;
    }
    if (cacheRef.current !== null) {
      setState({ status: "ready", data: cacheRef.current });
      return;
    }
    setState({ status: "loading" });
    try {
      const data = await fetchNumerologyDataset("karmicDebtsData");
      cacheRef.current = data;
      setState({ status: "ready", data });
    } catch (requestError) {
      setState({
        status: "error",
        message: getApiErrorMessage(requestError, "Impossible de charger les dettes karmiques")
      });
    }
  }, [needsDebtCopy, readingId]);

  useEffect(() => {
    if (!isActive || !needsDebtCopy) {
      return;
    }
    void load();
  }, [isActive, needsDebtCopy, load, readingId]);

  const reload = useCallback(async () => {
    cacheRef.current = null;
    await load();
  }, [load]);

  return { state, reload };
}
