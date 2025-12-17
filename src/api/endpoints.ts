/**
 * Endpoints de la API
 */

import { apiClient } from './client';
import type {
  ApiResponse,
  PaginatedResponse,
  LoginDTO,
  RegisterDTO,
  UpdateProfileDTO,
  ChangePasswordDTO,
  AuthResponse,
  User,
  Session,
  CreateUserDTO,
  UpdateUserDTO,
  UserFilters,
  CreateReservaDTO,
  UpdateReservaDTO,
  Reserva,
  ReservaFilters,
  CreatePeriodoDTO,
  UpdatePeriodoDTO,
  PeriodoLibras,
  PeriodoFilters,
  DashboardStats,
  HistoricoPeriodo,
  HistoricoReserva,
  HistoricoFilters,
  StatusReserva,
  Role,
  ReportesData,
  ReportesFilters,
} from '@/types';

// ============================================
// AUTH
// ============================================

export const authApi = {
  /**
   * Login
   */
  login: (data: LoginDTO) => {
    return apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  },

  /**
   * Register
   */
  register: (data: RegisterDTO) => {
    return apiClient.post<ApiResponse<User>>('/auth/register', data);
  },

  /**
   * Refresh token
   */
  refresh: (refreshToken: string) => {
    return apiClient.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
  },

  /**
   * Logout
   */
  logout: (refreshToken: string) => {
    return apiClient.post<ApiResponse>('/auth/logout', { refreshToken });
  },

  /**
   * Get profile
   */
  getProfile: () => {
    return apiClient.get<ApiResponse<User>>('/auth/me');
  },

  /**
   * Update profile
   */
  updateProfile: (data: UpdateProfileDTO) => {
    return apiClient.patch<ApiResponse<User>>('/auth/profile', data);
  },

  /**
   * Change password
   */
  changePassword: (data: ChangePasswordDTO) => {
    return apiClient.patch<ApiResponse>('/auth/password', data);
  },

  /**
   * Get sessions
   */
  getSessions: () => {
    return apiClient.get<ApiResponse<Session[]>>('/auth/sessions');
  },

  /**
   * Delete session
   */
  deleteSession: (sessionId: string) => {
    return apiClient.delete<ApiResponse>(`/auth/sessions/${sessionId}`);
  },
};

// ============================================
// USERS
// ============================================

export const usersApi = {
  /**
   * Create user (admin)
   */
  create: (data: CreateUserDTO) => {
    return apiClient.post<ApiResponse<User>>('/users', data);
  },

  /**
   * List users (admin)
   */
  list: (filters?: UserFilters) => {
    return apiClient.get<PaginatedResponse<User>>('/users', { params: filters });
  },

  /**
   * Get user by ID (admin)
   */
  getById: (userId: number) => {
    return apiClient.get<ApiResponse<User>>(`/users/${userId}`);
  },

  /**
   * Update user (admin)
   */
  update: (userId: number, data: UpdateUserDTO) => {
    return apiClient.patch<ApiResponse<User>>(`/users/${userId}`, data);
  },

  /**
   * Delete user (admin)
   */
  delete: (userId: number) => {
    return apiClient.delete<ApiResponse>(`/users/${userId}`);
  },

  /**
   * Change user role (admin)
   */
  changeRole: (userId: number, role: Role) => {
    return apiClient.patch<ApiResponse<User>>(`/users/${userId}/role`, { role });
  },
};

// ============================================
// RESERVAS
// ============================================

export const reservasApi = {
  /**
   * Create reserva
   */
  create: (data: CreateReservaDTO) => {
    return apiClient.post<ApiResponse<Reserva>>('/reservas', data);
  },

  /**
   * List reservas
   */
  list: (filters?: ReservaFilters) => {
    return apiClient.get<PaginatedResponse<Reserva>>('/reservas', { params: filters });
  },

  /**
   * Get reserva by ID
   */
  getById: (reservaId: number) => {
    return apiClient.get<ApiResponse<Reserva>>(`/reservas/${reservaId}`);
  },

  /**
   * Update reserva
   */
  update: (reservaId: number, data: UpdateReservaDTO) => {
    return apiClient.patch<ApiResponse<Reserva>>(`/reservas/${reservaId}`, data);
  },

  /**
   * Update status (admin)
   */
  updateStatus: (reservaId: number, status: StatusReserva) => {
    return apiClient.patch<ApiResponse<Reserva>>(`/reservas/${reservaId}/status`, { status });
  },

  /**
   * Delete reserva
   */
  delete: (reservaId: number) => {
    return apiClient.delete<ApiResponse>(`/reservas/${reservaId}`);
  },
};

// ============================================
// PERIODOS
// ============================================

export const periodosApi = {
  /**
   * Create periodo (admin)
   */
  create: (data: CreatePeriodoDTO) => {
    return apiClient.post<ApiResponse<PeriodoLibras>>('/periodos', data);
  },

  /**
   * List periodos (admin)
   */
  list: (filters?: PeriodoFilters) => {
    return apiClient.get<PaginatedResponse<PeriodoLibras>>('/periodos', { params: filters });
  },

  /**
   * Get periodo activo
   */
  getActive: () => {
    return apiClient.get<ApiResponse<PeriodoLibras & { librasReservadas: string; librasDisponibles: string; porcentajeOcupacion: number }>>('/periodos/active');
  },

  /**
   * Get periodo by ID (admin)
   */
  getById: (periodoId: number) => {
    return apiClient.get<ApiResponse<PeriodoLibras>>(`/periodos/${periodoId}`);
  },

  /**
   * Update periodo (admin)
   */
  update: (periodoId: number, data: UpdatePeriodoDTO) => {
    return apiClient.patch<ApiResponse<PeriodoLibras>>(`/periodos/${periodoId}`, data);
  },

  /**
   * Close periodo (admin)
   */
  close: (periodoId: number) => {
    return apiClient.post<ApiResponse<HistoricoPeriodo>>(`/periodos/${periodoId}/close`);
  },
};

// ============================================
// DASHBOARD
// ============================================

export const dashboardApi = {
  /**
   * Get stats
   */
  getStats: () => {
    return apiClient.get<ApiResponse<DashboardStats>>('/dashboard/stats');
  },

  /**
   * Get history
   */
  getHistory: (filters?: HistoricoFilters) => {
    return apiClient.get<PaginatedResponse<HistoricoPeriodo>>('/dashboard/history', { params: filters });
  },

  /**
   * Get reservas historicas
   */
  getReservasHistoricas: (periodoHistoricoId: number) => {
    return apiClient.get<ApiResponse<HistoricoReserva[]>>(`/dashboard/history/${periodoHistoricoId}/reservas`);
  },

  /**
 * Get reportes
 */
getReportes: (filters?: ReportesFilters) => {
  return apiClient.get<ApiResponse<ReportesData>>('/dashboard/reportes', { params: filters });
},

};

// ============================================
// PROFILE
// ============================================

export const profileApi = {
  /**
   * Obtener perfil
   */
  getProfile: () => {
    return apiClient.get<ApiResponse<User & { _count?: { reservas: number } }>>('/profile');
  },

  /**
   * Actualizar perfil
   */
  updateProfile: (data: UpdateProfileDTO) => {
    return apiClient.patch<ApiResponse<User>>('/profile', data);
  },

  /**
   * Cambiar contraseña
   */
  changePassword: (data: ChangePasswordDTO) => {
    return apiClient.patch<ApiResponse>('/profile/password', data);
  },

  /**
   * Subir avatar
   */
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post<ApiResponse<User>>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Eliminar avatar
   */
  deleteAvatar: () => {
    return apiClient.delete<ApiResponse<User>>('/profile/avatar');
  },
};