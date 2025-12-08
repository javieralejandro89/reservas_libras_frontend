/**
 * Hook de Usuarios (Admin)
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/endpoints';
import { CreateUserDTO, UpdateUserDTO, UserFilters, Role } from '@/types';
import { AxiosError } from 'axios';

export const useUsers = (filters?: UserFilters) => {
  const queryClient = useQueryClient();

  /**
   * Query: Listar usuarios
   */
  const {
    data: usersData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', filters],
    queryFn: async () => {
      const response = await usersApi.list(filters);
      return response.data;
    },
  });

  /**
   * Query: Obtener usuario por ID
   */
  const useUserById = (userId: number | null) => {
    return useQuery({
      queryKey: ['users', userId],
      queryFn: async () => {
        if (!userId) return null;
        const response = await usersApi.getById(userId);
        return response.data.data;
      },
      enabled: !!userId,
    });
  };

  /**
   * Mutation: Crear usuario
   */
  const createMutation = useMutation({
    mutationFn: (data: CreateUserDTO) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al crear usuario:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Actualizar usuario
   */
  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: UpdateUserDTO }) =>
      usersApi.update(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al actualizar usuario:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Eliminar usuario
   */
  const deleteMutation = useMutation({
    mutationFn: (userId: number) => usersApi.delete(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al eliminar usuario:', error.response?.data?.message);
    },
  });

  /**
   * Mutation: Cambiar rol
   */
  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: Role }) =>
      usersApi.changeRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      console.error('Error al cambiar rol:', error.response?.data?.message);
    },
  });

  return {
    // List
    users: usersData?.data || [],
    pagination: usersData?.pagination,
    isLoading,
    error,
    refetch,

    // Get by ID
    useUserById,

    // Create
    createUser: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,

    // Update
    updateUser: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,

    // Delete
    deleteUser: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,

    // Change role
    changeRole: changeRoleMutation.mutate,
    isChangingRole: changeRoleMutation.isPending,
  };
};