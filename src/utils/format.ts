/**
 * Utilidades para formatear datos
 */

import { parseISO } from 'date-fns';


/**
 * Formatear fecha sin problemas de timezone
 * Convierte "2025-12-04" o Date a "04/12/2025"
 */
export const formatDate = (date: string | Date | null | undefined): string => {
  // Manejar valores nulos o indefinidos
  if (!date) return '-';

  // Si es string en formato ISO (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)
  if (typeof date === 'string') {
    // Extraer solo la parte de fecha (antes de 'T' si existe)
    const dateOnly = date.split('T')[0];
    if (dateOnly && /^\d{4}-\d{2}-\d{2}$/.test(dateOnly)) {
      const [year, month, day] = dateOnly.split('-');
      return `${day}/${month}/${year}`;
    }
  }

  // Si es Date, convertir evitando timezone
  const d = date instanceof Date ? date : new Date(date);
  
  // Validar que la fecha sea válida
  if (isNaN(d.getTime())) return '-';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formatear fecha con hora sin problemas de timezone
 */
export const formatDateTime = (date: string | Date): string => {
  // Si es string en formato ISO, extraer y formatear
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  // Si es Date
  const d = date instanceof Date ? date : new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Formatear fecha relativa (hace X días)
 */
export const formatRelativeDate = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Hoy';
    if (diffInDays === 1) return 'Ayer';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    if (diffInDays < 30) return `Hace ${Math.floor(diffInDays / 7)} semanas`;
    if (diffInDays < 365) return `Hace ${Math.floor(diffInDays / 30)} meses`;
    return `Hace ${Math.floor(diffInDays / 365)} años`;
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Formatear número con decimales
 */
export const formatNumber = (value: number | string, decimals = 2): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00';
  return num.toFixed(decimals);
};

/**
 * Formatear libras (ej: 1,234.56 lbs)
 */
export const formatLibras = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0.00 lbs';
  return `${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} lbs`;
};

/**
 * Formatear porcentaje (ej: 85.50%)
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Truncar texto largo
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Capitalizar primera letra
 */
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * Obtener iniciales de un nombre
 */
export const getInitials = (name: string): string => {
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0]!.substring(0, 2).toUpperCase();
  return (words[0]!.charAt(0) + words[words.length - 1]!.charAt(0)).toUpperCase();
};

/**
 * Convertir fecha a formato input (YYYY-MM-DD) sin timezone
 */
export const toInputDate = (date: string | Date): string => {
  // Si ya es string en formato correcto, retornar directamente
  if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return date;
  }

  // Si es string con timestamp, extraer solo la fecha
  if (typeof date === 'string' && date.includes('T')) {
    return date.split('T')[0]!;
  }

  // Si es Date, convertir con offset de timezone
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

/**
 * Validar si una fecha es válida
 */
export const isValidDate = (date: string): boolean => {
  try {
    const parsed = parseISO(date);
    return !isNaN(parsed.getTime());
  } catch {
    return false;
  }
};