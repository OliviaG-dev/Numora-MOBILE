import { apiClient } from "./apiClient";

type NumerologyDatasetResponse = {
  datasetId: string;
  dataset: unknown;
};

export async function fetchNumerologyDataset(datasetId: string): Promise<unknown> {
  const response = await apiClient.get<NumerologyDatasetResponse>(`/numerology/data/${datasetId}`);
  return response.data.dataset;
}
