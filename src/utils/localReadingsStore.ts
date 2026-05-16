import type { CreateReadingPayload, Reading } from "../types/reading.types";

let localReadings: Reading[] = [];

function createId(): string {
  return `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function listLocalReadings(): Reading[] {
  return [...localReadings].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createLocalReading(payload: CreateReadingPayload): Reading {
  const reading: Reading = {
    id: createId(),
    userId: "dev-local",
    firstName: payload.firstName,
    lastName: payload.lastName,
    birthDate: payload.birthDate,
    category: payload.category,
    results: payload.results,
    createdAt: new Date().toISOString()
  };
  localReadings = [reading, ...localReadings];
  return reading;
}

export function getLocalReadingById(readingId: string): Reading | null {
  return localReadings.find((r) => r.id === readingId) ?? null;
}

export function deleteLocalReading(readingId: string): boolean {
  const before = localReadings.length;
  localReadings = localReadings.filter((r) => r.id !== readingId);
  return localReadings.length < before;
}
