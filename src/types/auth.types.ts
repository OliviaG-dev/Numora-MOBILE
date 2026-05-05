export type User = {
  id: string;
  email: string;
  createdAt: string;
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type MeResponse = {
  user: User;
};

export type AuthPayload = {
  email: string;
  password: string;
};
