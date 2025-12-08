/**
 * Filtros de Usuarios
 */

import { Input, Select, Button } from '@/components/ui';
import { Search, X } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '@/constants';
import type { UserFilters } from '@/types';

interface UsuariosFiltersProps {
  filters: UserFilters;
  onFilterChange: (filters: Partial<UserFilters>) => void;
  onClearFilters: () => void;
}

export const UsuariosFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
}: UsuariosFiltersProps) => {
  const hasActiveFilters = filters.search || filters.role || filters.isActive !== undefined;

  // Opciones de rol
  const roleOptions = [
    { value: '', label: 'Todos los roles' },
    ...Object.entries(ROLE_LABELS).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  // Opciones de estado
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'true', label: 'Activos' },
    { value: 'false', label: 'Inactivos' },
  ];

  return (
    <div className="bg-white p-3 sm:p-6 rounded-lg border border-gray-200 shadow-sm space-y-3 sm:space-y-4">
      {/* Búsqueda */}
      <div className="relative">
  <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
  <Input
    type="text"
    placeholder="Buscar por nombre o email..."
    value={filters.search || ''}
    onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
    className="pl-8 sm:pl-10"
  />
</div>

      {/* Filtros en Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
        {/* Rol */}
        <Select
          value={filters.role || ''}
          onChange={(e) =>
            onFilterChange({
              role: e.target.value ? (e.target.value as typeof ROLES.ADMIN_PRINCIPAL | typeof ROLES.USUARIO) : undefined,
              page: 1,
            })
          }
          options={roleOptions}
        />

        {/* Estado */}
        <Select
          value={
            filters.isActive === undefined
              ? ''
              : filters.isActive
              ? 'true'
              : 'false'
          }
          onChange={(e) =>
            onFilterChange({
              isActive: e.target.value === '' ? undefined : e.target.value === 'true',
              page: 1,
            })
          }
          options={statusOptions}
        />

        {/* Botón Limpiar */}
        {hasActiveFilters && (
          <Button
  variant="secondary"
  onClick={onClearFilters}
  className="flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors text-xs sm:text-sm py-1.5 sm:py-2"
>
  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
  <span>Limpiar Filtros</span>
</Button>
        )}
      </div>

      {/* Indicador de filtros activos */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2 border-t border-gray-100">
  <span className="text-[10px] sm:text-xs text-gray-500 font-medium">Filtros activos:</span>
          
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary-100 text-primary-700 text-[10px] sm:text-xs rounded-md">
              Búsqueda: "{filters.search}"
            </span>
          )}
          
          {filters.role && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md">
              Rol: {ROLE_LABELS[filters.role]}
            </span>
          )}
          
          {filters.isActive !== undefined && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-md">
              Estado: {filters.isActive ? 'Activo' : 'Inactivo'}
            </span>
          )}
        </div>
      )}
    </div>
  );
};