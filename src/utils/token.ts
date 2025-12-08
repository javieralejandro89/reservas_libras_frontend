/**
 * Utilidades para manejo de tokens
 */

import { TOKEN_KEYS } from '@/constants';

/**
 * Guardar access token
 */
export const setAccessToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, token);
};

/**
 * Obtener access token
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Eliminar access token
 */
export const removeAccessToken = (): void => {
  localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
};

/**
 * Guardar refresh token
 */
export const setRefreshToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, token);
};

/**
 * Obtener refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Eliminar refresh token
 */
export const removeRefreshToken = (): void => {
  localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
};

/**
 * Guardar ambos tokens
 */
export const setTokens = (accessToken: string, refreshToken: string): void => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

/**
 * Eliminar todos los tokens
 */
export const clearTokens = (): void => {
  removeAccessToken();
  removeRefreshToken();
};

/**
 * Verificar si hay tokens
 */
export const hasTokens = (): boolean => {
  return !!(getAccessToken() && getRefreshToken());
};