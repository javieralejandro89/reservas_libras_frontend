/**
 * Store de Autenticación
 */

import { create } from 'zustand';
import { User } from '@/types';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/token';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Establecer usuario
   */
  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
    }),

  /**
   * Guardar tokens
   */
  setTokens: (accessToken, refreshToken) => {
    setTokens(accessToken, refreshToken);
  },

  /**
   * Cerrar sesión
   */
  logout: () => {
    clearTokens();
    set({
      user: null,
      isAuthenticated: false,
    });
  },

  /**
   * Establecer loading
   */
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  /**
   * Inicializar autenticación (verificar si hay tokens)
   */
  initAuth: () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (accessToken && refreshToken) {
      // Hay tokens, el usuario está autenticado
      // El usuario se cargará en el layout con una petición al backend
      set({
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      set({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));