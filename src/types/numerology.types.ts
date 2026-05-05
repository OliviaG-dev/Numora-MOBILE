export type NumerologyCalculatePayload = {
  fullName: string;
  birthDate: string;
  referenceDate?: string;
  address?: {
    streetNumber: string;
    streetName: string;
    allowMasterNumbers?: boolean;
  };
  locality?: {
    postalCode: string;
    city: string;
    allowMasterNumbers?: boolean;
  };
};

export type NumerologyResult = {
  identity: {
    fullName: string;
    birthDate: string;
  };
  core: Record<string, unknown>;
  personal: Record<string, unknown>;
  challenges: Record<string, unknown>;
  karmic: Record<string, unknown>;
  matrixDestiny: unknown;
  treeOfLife: unknown;
  universalVibrations: unknown;
  business: unknown;
  place: {
    addressVibration?: unknown;
    localityVibration?: unknown;
  };
};

export type NumerologyCalculateResponse = {
  result: NumerologyResult;
};
