import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "../services/apiClient";
import { fetchNumerologyDataset } from "../services/numerologyDataService";
import type { CrystalExpressionEntry, CrystalPathEntry, CrystalSyntheseProfil } from "../types/crystal.types";
import {
  findCrystalExpressionEntry,
  findCrystalPathEntry,
  findCrystalSyntheseEntry
} from "../utils/crystalLookup";

type CrystalProfileState = {
  isLoading: boolean;
  error: string | null;
  pathEntry: CrystalPathEntry | null;
  expressionEntry: CrystalExpressionEntry | null;
  synthese: CrystalSyntheseProfil | null;
};

const INITIAL: CrystalProfileState = {
  isLoading: false,
  error: null,
  pathEntry: null,
  expressionEntry: null,
  synthese: null
};

export function useCrystalProfile(lifePath: number | null, expression: number | null) {
  const [state, setState] = useState<CrystalProfileState>(INITIAL);

  const load = useCallback(async () => {
    if (lifePath === null || expression === null || Number.isNaN(lifePath) || Number.isNaN(expression)) {
      setState(INITIAL);
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const [pathDataset, expressionDataset, syntheseDataset] = await Promise.all([
        fetchNumerologyDataset("crystalPathData"),
        fetchNumerologyDataset("crystalExpressionData"),
        fetchNumerologyDataset("crystalSyntheseData")
      ]);

      setState({
        isLoading: false,
        error: null,
        pathEntry: findCrystalPathEntry(pathDataset, lifePath),
        expressionEntry: findCrystalExpressionEntry(expressionDataset, expression),
        synthese: findCrystalSyntheseEntry(syntheseDataset, lifePath, expression)
      });
    } catch (requestError) {
      setState({
        isLoading: false,
        error: getApiErrorMessage(requestError, "Unable to load crystal data"),
        pathEntry: null,
        expressionEntry: null,
        synthese: null
      });
    }
  }, [lifePath, expression]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, reload: load };
}
