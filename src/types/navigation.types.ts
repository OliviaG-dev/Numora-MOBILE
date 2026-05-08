export type AuthStackParamList = {
  Auth: undefined;
};

export type AppStackParamList = {
  Home: undefined;
  Numerology: undefined;
  NewReading: undefined;
  ReadingDetail: { readingId: string };
};
