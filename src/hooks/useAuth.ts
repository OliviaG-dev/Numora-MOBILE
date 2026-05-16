import { useCallback, useEffect, useState } from "react";

import { DEV_MOCK_USER, SKIP_AUTH } from "../config/devAuth";
import { getApiErrorMessage, setAuthorizationToken } from "../services/apiClient";
import { login as loginRequest, me, register as registerRequest } from "../services/authService";
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken
} from "../services/secureStorageService";
import type { User } from "../types/auth.types";

type Credentials = {
  email: string;
  password: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void bootstrapAuth();
  }, []);

  const bootstrapAuth = useCallback(async () => {
    if (SKIP_AUTH) {
      setUser(DEV_MOCK_USER);
      setToken(null);
      setAuthorizationToken(null);
      setIsBootstrapping(false);
      return;
    }

    try {
      const savedToken = await getAuthToken();
      if (!savedToken) {
        return;
      }

      setAuthorizationToken(savedToken);
      const response = await me();
      setToken(savedToken);
      setUser(response.user);
    } catch {
      await clearAuthToken();
      setAuthorizationToken(null);
      setToken(null);
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  const login = useCallback(async (credentials: Credentials) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await loginRequest(credentials);
      await setAuthToken(response.token);
      setAuthorizationToken(response.token);
      setToken(response.token);
      setUser(response.user);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to login"));
      throw requestError;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const register = useCallback(async (credentials: Credentials) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await registerRequest(credentials);
      await login(credentials);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to register"));
      throw requestError;
    } finally {
      setIsSubmitting(false);
    }
  }, [login]);

  const logout = useCallback(async () => {
    if (SKIP_AUTH) {
      setUser(DEV_MOCK_USER);
      setToken(null);
      setAuthorizationToken(null);
      setError(null);
      return;
    }

    await clearAuthToken();
    setAuthorizationToken(null);
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const isAuthenticated = SKIP_AUTH ? Boolean(user) : Boolean(user && token);

  return {
    user,
    token,
    isAuthenticated,
    isBootstrapping,
    isSubmitting,
    error,
    login,
    register,
    logout,
    skipAuth: SKIP_AUTH
  };
}
