import type { User } from "../types/auth.types";

/**
 * Mode dev temporaire : pas d'écran de connexion.
 * Activer via `.env.local` : EXPO_PUBLIC_SKIP_AUTH=true
 */
export const SKIP_AUTH = process.env.EXPO_PUBLIC_SKIP_AUTH === "true";

export const DEV_MOCK_USER: User = {
  id: "dev-local",
  email: "mode.demo@numora.local",
  createdAt: new Date().toISOString()
};
