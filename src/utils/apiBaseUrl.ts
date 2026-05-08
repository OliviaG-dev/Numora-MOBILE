import { Platform } from "react-native";

const DEFAULT_PORT = "3000";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (fromEnv) {
    return withApiPrefix(fromEnv);
  }

  if (Platform.OS === "android") {
    return `http://10.0.2.2:${DEFAULT_PORT}/api`;
  }

  return `http://localhost:${DEFAULT_PORT}/api`;
}

function withApiPrefix(baseUrl: string): string {
  if (baseUrl.endsWith("/api")) {
    return baseUrl;
  }

  return `${baseUrl}/api`;
}
