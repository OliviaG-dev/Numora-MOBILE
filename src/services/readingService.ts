import { apiClient } from "./apiClient";
import type {
  CreateReadingPayload,
  ReadingResponse,
  ReadingsResponse
} from "../types/reading.types";

export async function listReadings(): Promise<ReadingsResponse> {
  const response = await apiClient.get<ReadingsResponse>("/readings");
  return response.data;
}

export async function createReading(payload: CreateReadingPayload): Promise<ReadingResponse> {
  const response = await apiClient.post<ReadingResponse>("/readings", payload);
  return response.data;
}

export async function getReadingById(readingId: string): Promise<ReadingResponse> {
  const response = await apiClient.get<ReadingResponse>(`/readings/${readingId}`);
  return response.data;
}

export async function deleteReading(readingId: string): Promise<void> {
  await apiClient.delete(`/readings/${readingId}`);
}
