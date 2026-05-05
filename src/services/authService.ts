import { apiClient } from "./apiClient";
import type { AuthPayload, AuthResponse, MeResponse } from "../types/auth.types";

export async function register(payload: AuthPayload): Promise<{ user: MeResponse["user"] }> {
  const response = await apiClient.post<{ user: MeResponse["user"] }>(
    "/auth/register",
    payload
  );

  return response.data;
}

export async function login(payload: AuthPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>("/auth/login", payload);
  return response.data;
}

export async function me(): Promise<MeResponse> {
  const response = await apiClient.get<MeResponse>("/auth/me");
  return response.data;
}
