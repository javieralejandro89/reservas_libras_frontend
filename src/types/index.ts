/**
 * Tipos TypeScript del Frontend
 * Sincronizados con el backend
 */

// ============================================
// ENUMERACIONES
// ============================================

export enum Role {
  ADMIN_PRINCIPAL = 'ADMIN_PRINCIPAL',
  USUARIO = 'USUARIO',
}

export enum StatusReserva {
  PENDIENTE = 'PENDIENTE',
  CONFIRMADA = 'CONFIRMADA',
  ENVIADA = 'ENVIADA',
  ENTREGADA = 'ENTREGADA',
  CANCELADA = 'CANCELADA',
}

// ============================================
// MODELOS
// ============================================

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string | null;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: string;
  createdAt: string;
}

export interface PeriodoLibras {
  id: number;
  librasTotales: number;
  fechaEnvio: string; // Fecha única de envío
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    reservas: number;
  };
}

export interface Reserva {
  id: number;
  libras: string | number;
  fecha: string;
  estado: string;
  observaciones: string | null;
  status: StatusReserva;
  // Tracking de cambios de estado
  fechaConfirmacion: string | null;
  fechaEnvio: string | null;
  fechaEntrega: string | null;
  userId: number;
  periodoId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  periodo?: {
    id: number;
    librasTotales: number;
    fechaEnvio: string; // Fecha única de envío
  };
}

export interface HistoricoPeriodo {
  id: number;
  librasTotales: number;
  librasReservadas: string;
  librasDisponibles: string;
  fechaEnvio: string; // Fecha única de envío
  totalReservas: number;
  totalUsuarios: number;
  fechaArchivado: string;
}

export interface HistoricoReserva {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  libras: string;
  fecha: string;
  estado: string;
  observaciones: string | null;
  status: StatusReserva;
  periodoFechaEnvio: string; // Fecha única de envío
  reservaOriginalId: number;
  fechaArchivado: string;
}

// ============================================
// DTOs
// ============================================

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfileDTO {
  name: string;
}

export interface ChangeProfilePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileData extends User {
  avatar: string | null;
  _count?: {
    reservas: number;
  };
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
  refreshToken?: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: Role;
  isActive?: boolean;
}

export interface CreatePeriodoDTO {
  librasTotales: number;
  fechaEnvio: string; // Fecha única de envío
}

export interface UpdatePeriodoDTO {
  librasTotales?: number;
  fechaEnvio?: string; // Fecha única de envío
}

export interface CreateReservaDTO {
  libras: number;
  fecha: string;
  estado: string;
  observaciones?: string;
}

export interface UpdateReservaDTO {
  libras?: number;
  fecha?: string;
  estado?: string;
  observaciones?: string;
  status?: StatusReserva;
}

// ============================================
// RESPUESTAS API
// ============================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = unknown> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ============================================
// DASHBOARD
// ============================================

export interface UserReservaSummary {
  userId: number;
  userName: string;
  userEmail: string;
  totalLibras: string;
  totalReservas: number;
}

/**
 * Estadísticas de un periodo individual
 */
export interface PeriodoStats {
  periodo: {
    id: number;
    librasTotales: number;
    fechaEnvio: string; // Fecha única de envío
    isActive: boolean;
  };
  librasReservadas: string;
  librasDisponibles: string;
  librasEnCentral: string;      // ENTREGADAS
  librasEnTransito: string;     // CONFIRMADAS + ENVIADAS
  librasPendientes: string;     // PENDIENTES
  porcentajeOcupacion: number;
  totalReservas: number;
  totalUsuariosConReservas: number;
  reservasPorStatus: {
    status: StatusReserva;
    count: number;
  }[];
  usuariosConReservas: UserReservaSummary[];
}

/**
 * Estadísticas del dashboard (múltiples periodos)
 */
export interface DashboardStats {
  periodos: PeriodoStats[];
  totalLibrasReservadas: string;
  totalLibrasDisponibles: string;
  totalReservas: number;
  totalUsuariosConReservas: number;
  usuariosConReservas: UserReservaSummary[];
}

// ============================================
// FILTROS Y QUERIES
// ============================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ReservaFilters extends PaginationParams {
  userId?: number;
  status?: StatusReserva;
  estado?: string;
  periodoId?: number;
  startDate?: string;
  endDate?: string;
}

export interface UserFilters extends PaginationParams {
  role?: Role;
  isActive?: boolean;
  search?: string;
}

export interface PeriodoFilters extends PaginationParams {
  isActive?: boolean;
}

export interface HistoricoFilters extends PaginationParams {
  startDate?: string;
  endDate?: string;
  orderBy?: 'fechaArchivado' | 'fechaEnvio' | 'librasTotales' | 'totalReservas';
  orderDirection?: 'asc' | 'desc';
}

// ============================================
// REPORTES
// ============================================

export interface ReporteUsuario {
  userId: number;
  userName: string;
  userEmail: string;
  totalLibras: string;
  totalReservas: number;
  periodoCount: number;
  porcentajeDelTotal: number;
}

export interface ReporteMensual {
  mes: string;
  year: number;
  totalLibras: string;
  totalReservas: number;
  totalUsuarios: number;
  periodos: number;
}

export interface ReportePeriodo {
  periodoId: number;
  fechaEnvio: string; // Fecha única de envío
  librasTotales: number;
  librasReservadas: string;
  porcentajeOcupacion: number;
  totalReservas: number;
  totalUsuarios: number;
}

export interface ReporteEstado {
  estado: string;
  totalLibras: string;
  totalReservas: number;
  totalUsuarios: number;
  porcentajeDelTotal: number;
}

export interface ReportesData {
  porUsuario: ReporteUsuario[];
  porMes: ReporteMensual[];
  porPeriodo: ReportePeriodo[];
  porEstado: ReporteEstado[];
  resumen: {
    totalLibrasGlobal: string;
    totalReservasGlobal: number;
    totalUsuariosUnicos: number;
    totalPeriodos: number;
    promedioLibrasPorUsuario: string;
    promedioLibrasPorPeriodo: string;
  };
}

export interface ReportesFilters {
  startDate?: string;
  endDate?: string;
  userId?: number;
  estado?: string;
  periodoId?: number;
}

// ============================================
// UTILIDADES
// ============================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;