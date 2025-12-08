/**
 * Hook de Autenticación
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores';
import { LoginDTO, RegisterDTO, UpdateProfileDTO, ChangePasswordDTO } from '@/types';
import { ROUTES, ERROR_MESSAGES } from '@/constants';
import { getRefreshToken } from '@/utils/token';
import { AxiosError } from 'axios';

export const useAuth = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setUser, setTokens, logout: logoutStore } = useAuthStore();

  /**
   * Query: Obtener perfil del usuario
   */
  const {
    data: profile,
    isLoading: isLoadingProfile,
    error: profileError,
    refetch: refetchProfile,
  } = useQuery({
    queryKey: ['auth', 'profile'],
    queryFn: async () => {
      const response = await authApi.getProfile();
      return response.data.data;
    },
    enabled: false, // Se ejecuta manualmente
    retry: false,
  });

  /**
   * Mutation: Login
   */
  const loginMutation = useMutation({
    mutationFn: (data: LoginDTO) => authApi.login(data),
    onSuccess: (response) => {
      const { user, accessToken, refreshToken } = response.data.data!;
      setUser(user);
      setTokens(accessToken, refreshToken);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
      navigate(ROUTES.DASHBOARD);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error en login:', error.response?.data?.message || ERROR_MESSAGES.GENERIC);
    },
  });

  /**
   * Mutation: Register
   */
  const registerMutation = useMutation({
    mutationFn: (data: RegisterDTO) => authApi.register(data),
    onSuccess: () => {
      navigate(ROUTES.LOGIN);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error en registro:', error.response?.data?.message || ERROR_MESSAGES.GENERIC);
    },
  });

  /**
   * Mutation: Logout
   */
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    },
    onSuccess: () => {
      logoutStore();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      // Logout local incluso si falla el backend
      logoutStore();
      queryClient.clear();
      navigate(ROUTES.LOGIN);
    },
  });

  /**
   * Mutation: Update profile
   */
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileDTO) => authApi.updateProfile(data),
    onSuccess: (response) => {
      setUser(response.data.data!);
      queryClient.invalidateQueries({ queryKey: ['auth', 'profile'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al actualizar perfil:', error.response?.data?.message || ERROR_MESSAGES.GENERIC);
    },
  });

  /**
   * Mutation: Change password
   */
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordDTO) => authApi.changePassword(data),
    onSuccess: () => {
      // Success handled by component
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al cambiar contraseña:', error.response?.data?.message || ERROR_MESSAGES.GENERIC);
    },
  });

  /**
   * Query: Obtener sesiones activas
   */
  const {
    data: sessions,
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = useQuery({
    queryKey: ['auth', 'sessions'],
    queryFn: async () => {
      const response = await authApi.getSessions();
      return response.data.data;
    },
    enabled: false,
  });

  /**
   * Mutation: Eliminar sesión
   */
  const deleteSessionMutation = useMutation({
    mutationFn: (sessionId: string) => authApi.deleteSession(sessionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'sessions'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al eliminar sesión:', error.response?.data?.message || ERROR_MESSAGES.GENERIC);
    },
  });

  return {
    // Profile
    profile,
    isLoadingProfile,
    profileError,
    refetchProfile,

    // Login
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    // Register
    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    // Logout
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,

    // Update profile
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    // Change password
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,

    // Sessions
    sessions,
    isLoadingSessions,
    refetchSessions,
    deleteSession: deleteSessionMutation.mutate,
    isDeletingSession: deleteSessionMutation.isPending,
  };
};