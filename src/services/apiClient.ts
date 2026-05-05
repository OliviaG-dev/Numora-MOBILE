import axios from "axios";

import { getApiBaseUrl } from "../utils/apiBaseUrl";

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000
});

export function setAuthorizationToken(token: string | null): void {
  if (!token) {
    delete apiClient.defaults.headers.common.Authorization;
    return;
  }

  apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallback;
}
