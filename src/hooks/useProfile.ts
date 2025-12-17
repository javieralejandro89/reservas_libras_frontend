/**
 * Hook de Perfil de Usuario
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '@/api/endpoints';
import { useAuthStore } from '@/stores';
import { UpdateProfileDTO, ChangeProfilePasswordDTO } from '@/types';
import { AxiosError } from 'axios';

export const useProfile = () => {
  const queryClient = useQueryClient();
  const { setUser, logout } = useAuthStore();

  /**
   * Query: Obtener perfil
   */
  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await profileApi.getProfile();
      return response.data.data;
    },
  });

  /**
   * Mutation: Actualizar nombre
   */
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileDTO) => profileApi.updateProfile(data),
    onSuccess: (response) => {
      if (response.data.data) {
        setUser(response.data.data);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al actualizar perfil:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Cambiar contraseña
   */
  const changePasswordMutation = useMutation({
    mutationFn: (data: ChangeProfilePasswordDTO) => profileApi.changePassword(data),
    onSuccess: () => {
      // Forzar logout después de cambiar contraseña
      setTimeout(() => {
        logout();
      }, 2000);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al cambiar contraseña:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Subir avatar
   */
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => profileApi.uploadAvatar(file),
    onSuccess: (response) => {
      if (response.data.data) {
        setUser(response.data.data);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al subir avatar:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Eliminar avatar
   */
  const deleteAvatarMutation = useMutation({
    mutationFn: () => profileApi.deleteAvatar(),
    onSuccess: (response) => {
      if (response.data.data) {
        setUser(response.data.data);
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      }
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al eliminar avatar:', error.response?.data?.message);
    },
  });

  return {
    // Data
    profile: profileData,
    isLoading,
    error,
    refetch,

    // Update profile
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,

    // Change password
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,

    // Upload avatar
    uploadAvatar: uploadAvatarMutation.mutate,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    uploadAvatarError: uploadAvatarMutation.error,

    // Delete avatar
    deleteAvatar: deleteAvatarMutation.mutate,
    isDeletingAvatar: deleteAvatarMutation.isPending,
  };
};