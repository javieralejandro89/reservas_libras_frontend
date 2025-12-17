/**
 * Constantes del Frontend
 */

import { Role, StatusReserva } from '@/types';

// ============================================
// ROLES
// ============================================

export const ROLES = {
  ADMIN_PRINCIPAL: 'ADMIN_PRINCIPAL' as Role,
  USUARIO: 'USUARIO' as Role,
};

export const ROLE_LABELS = {
  ADMIN_PRINCIPAL: 'Administrador',
  USUARIO: 'Usuario',
} satisfies Record<Role, string>;

// ============================================
// ESTADOS DE RESERVA
// ============================================

export const STATUS_RESERVA = {
  PENDIENTE: 'PENDIENTE' as StatusReserva,
  CONFIRMADA: 'CONFIRMADA' as StatusReserva,
  ENVIADA: 'ENVIADA' as StatusReserva,
  ENTREGADA: 'ENTREGADA' as StatusReserva,
  CANCELADA: 'CANCELADA' as StatusReserva,
};

export const STATUS_LABELS = {
  PENDIENTE: 'Pendiente',
  CONFIRMADA: 'Confirmada',
  ENVIADA: 'Enviada',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
} satisfies Record<StatusReserva, string>;

export const STATUS_COLORS = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADA: 'bg-blue-100 text-blue-800',
  ENVIADA: 'bg-purple-100 text-purple-800',
  ENTREGADA: 'bg-green-100 text-green-800',
  CANCELADA: 'bg-red-100 text-red-800',
} satisfies Record<StatusReserva, string>;

// ============================================
// TRANSICIONES DE ESTADO PERMITIDAS
// ============================================

/**
 * Obtener estados disponibles según rol y estado actual
 */
export const getAvailableStatuses = (
  currentStatus: StatusReserva,
  userRole: Role
): StatusReserva[] => {
  // No se puede modificar estados finales
  if (currentStatus === STATUS_RESERVA.ENTREGADA || currentStatus === STATUS_RESERVA.CANCELADA) {
    return [currentStatus]; // Solo mostrar el actual (readonly)
  }

  // ADMIN_PRINCIPAL
  if (userRole === ROLES.ADMIN_PRINCIPAL) {
    switch (currentStatus) {
      case STATUS_RESERVA.PENDIENTE:
        return [
          STATUS_RESERVA.PENDIENTE,
          STATUS_RESERVA.CONFIRMADA,
          STATUS_RESERVA.CANCELADA,
        ];
      case STATUS_RESERVA.CONFIRMADA:
        return [
          STATUS_RESERVA.CONFIRMADA,
          STATUS_RESERVA.ENVIADA,
          STATUS_RESERVA.CANCELADA,
        ];
      case STATUS_RESERVA.ENVIADA:
        return [
          STATUS_RESERVA.ENVIADA,
          STATUS_RESERVA.ENTREGADA,
          STATUS_RESERVA.CANCELADA,
        ];
      default:
        return [currentStatus];
    }
  }

  // USUARIO (otros admins) - solo puede cambiar CONFIRMADA a ENVIADA
  if (userRole === ROLES.USUARIO) {
    if (currentStatus === STATUS_RESERVA.CONFIRMADA) {
      return [STATUS_RESERVA.CONFIRMADA, STATUS_RESERVA.ENVIADA];
    }
    // Para cualquier otro estado, solo lectura
    return [currentStatus];
  }

  return [currentStatus];
};

// ============================================
// ESTADOS DE MÉXICO
// ============================================

export const ESTADOS_MEXICO = [
  'Aguascalientes',  
  'Campeche',
  'Cancún',
  'Chiapas',
  'Chihuahua',
  'CDMX',
  'CDMX Sur',  
  'Guadalajara',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Michoacán',
  'Monterrey',  
  'Puebla',
  'Puerto Vallarta',
  'Querétaro',  
  'San Luis Potosí',
  'Saltillo',  
  'Texcoco',
  'Tlaxcala',
  'Tijuana',
  'Toluca',
  'Veracruz',
  'Yucatán',
  'Xalapa',
  'Zacatecas',
];

// ============================================
// PAGINACIÓN
// ============================================

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  LIMITS: [10, 20, 50, 100],
};

// ============================================
// VALIDACIONES
// ============================================

export const VALIDATION_RULES = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
    REQUIREMENTS: [
      'Mínimo 8 caracteres',
      'Al menos una mayúscula',
      'Al menos una minúscula',
      'Al menos un número',
      'Al menos un carácter especial (@$!%*?&#)',
    ],
  },
  LIBRAS: {
    MIN: 0.01,
    MAX: 10000,
  },
  OBSERVACIONES: {
    MAX_LENGTH: 1000,
  },
};

// ============================================
// MENSAJES
// ============================================

export const SUCCESS_MESSAGES = {
  LOGIN: 'Sesión iniciada correctamente',
  LOGOUT: 'Sesión cerrada correctamente',
  REGISTER: 'Usuario registrado correctamente',
  PROFILE_UPDATED: 'Perfil actualizado correctamente',
  PASSWORD_CHANGED: 'Contraseña cambiada correctamente',
  USER_CREATED: 'Usuario creado correctamente',
  USER_UPDATED: 'Usuario actualizado correctamente',
  USER_DELETED: 'Usuario eliminado correctamente',
  RESERVA_CREATED: 'Reserva creada correctamente',
  RESERVA_UPDATED: 'Reserva actualizada correctamente',
  RESERVA_DELETED: 'Reserva eliminada correctamente',
  PERIODO_CREATED: 'Periodo creado correctamente',
  PERIODO_UPDATED: 'Periodo actualizado correctamente',
  PERIODO_CLOSED: 'Periodo cerrado y archivado correctamente',
};

export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Inténtalo de nuevo.',
  NETWORK: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No autorizado. Inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  VALIDATION: 'Por favor verifica los datos ingresados.',
  SERVER: 'Error del servidor. Inténtalo más tarde.',
};

// ============================================
// RUTAS
// ============================================

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  RESERVAS: '/reservas',
  PERIODOS: '/periodos',
  REPORTES: '/reportes',
  USUARIOS: '/usuarios',
  PERFIL: '/perfil',
  HISTORICO: '/historico',
  PROFILE: '/profile',
};

// ============================================
// TOKENS
// ============================================

export const TOKEN_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

// ============================================
// CONFIGURACIÓN
// ============================================

export const APP_CONFIG = {
  APP_NAME: 'Sistema de Reservas',
  DEFAULT_LIBRAS_TOTALES: 2000,
};