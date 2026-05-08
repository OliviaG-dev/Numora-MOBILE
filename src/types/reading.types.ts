export const READING_CATEGORIES = [
  "life-path",
  "compatibility",
  "forecast",
  "custom"
] as const;

export type ReadingCategory = (typeof READING_CATEGORIES)[number];

export type Reading = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  category: ReadingCategory;
  results: Record<string, unknown>;
  createdAt: string;
};

export type ReadingsResponse = {
  readings: Reading[];
};

export type ReadingResponse = {
  reading: Reading;
};

export type CreateReadingPayload = {
  firstName: string;
  lastName: string;
  birthDate: string;
  category: ReadingCategory;
  results: Record<string, unknown>;
};
