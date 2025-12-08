/**
 * Tabla de Usuarios
 */

import { useState } from 'react';
import { useUsers } from '@/hooks';
import { useUIStore } from '@/stores';
import { Button, Badge } from '@/components/ui';
import { Edit2, Trash2, ShieldCheck, Shield, CheckCircle, XCircle } from 'lucide-react';
import { formatDateTime } from '@/utils/format';
import { ROLE_LABELS, ROLES } from '@/constants';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import type { User, Role } from '@/types';

interface UsuarioTableProps {
  usuarios: User[];
}

export const UsuarioTable = ({ usuarios }: UsuarioTableProps) => {
  const { openUserModal, openConfirmModal } = useUIStore();
  const { deleteUser, changeRole } = useUsers();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const handleEdit = (userId: number) => {
    openUserModal('edit', userId);
  };

  const handleDelete = (user: User) => {
    openConfirmModal({
      title: 'Eliminar Usuario',
      message: `¿Estás seguro de eliminar a ${user.name}? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      onConfirm: () => {
        setDeletingId(user.id);
        deleteUser(user.id, {
          onSuccess: () => {
            toast.success('Usuario eliminado correctamente');
            setDeletingId(null);
          },
          onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Error al eliminar usuario');
            setDeletingId(null);
          },
        });
      },
    });
  };

  const handleToggleRole = (user: User) => {
    const newRole = user.role === ROLES.ADMIN_PRINCIPAL ? ROLES.USUARIO : ROLES.ADMIN_PRINCIPAL;
    
    openConfirmModal({
      title: 'Cambiar Rol',
      message: `¿Cambiar el rol de ${user.name} a ${ROLE_LABELS[newRole]}?`,
      confirmText: 'Cambiar',
      onConfirm: () => {
        changeRole(
          { userId: user.id, role: newRole },
          {
            onSuccess: () => {
              toast.success('Rol actualizado correctamente');
            },
            onError: (error: AxiosError<{ message?: string }>) => {
              toast.error(error.response?.data?.message || 'Error al cambiar rol');
            },
          }
        );
      },
    });
  };

  const getRoleBadge = (role: Role) => {
    if (role === ROLES.ADMIN_PRINCIPAL) {
      return (
        <Badge variant="primary" className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
  <span className="hidden sm:inline">{ROLE_LABELS[role]}</span>
  <span className="sm:hidden">Admin</span>
</Badge>
      );
    }
    return (
      <Badge variant="gray" className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs">
  <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
  <span className="hidden sm:inline">{ROLE_LABELS[role]}</span>
  <span className="sm:hidden">Usuario</span>
</Badge>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Usuario
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rol
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registrado
            </th>
            <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {usuarios.map((usuario) => (
            <tr
              key={usuario.id}
              className="hover:bg-gray-50 transition-colors duration-150"
            >
              {/* Usuario */}
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
  <div className="flex items-center">
    <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs sm:text-base font-semibold shadow-md">
        {usuario.name.charAt(0).toUpperCase()}
      </div>
    </div>
    <div className="ml-2 sm:ml-4 min-w-0">
      <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">
        {usuario.name}
      </div>
      <div className="text-xs sm:text-sm text-gray-500 truncate">{usuario.email}</div>
    </div>
  </div>
</td>

              {/* Rol */}
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
  {getRoleBadge(usuario.role)}
</td>

              {/* Estado */}
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
  <div className="flex items-center gap-1 sm:gap-2">
    {usuario.isActive ? (
      <>
        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
        <span className="text-xs sm:text-sm font-medium text-green-700">
          Activo
        </span>
      </>
    ) : (
      <>
        <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
        <span className="text-xs sm:text-sm font-medium text-red-700">
          Inactivo
        </span>
      </>
    )}
  </div>
</td>

              {/* Fecha */}
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
  <span className="hidden sm:inline">{formatDateTime(usuario.createdAt)}</span>
  <span className="sm:hidden">{new Date(usuario.createdAt).toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: '2-digit' })}</span>
</td>

              {/* Acciones */}
              <td className="px-2 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-xs sm:text-sm font-medium">
  <div className="flex items-center justify-end gap-1 sm:gap-2">
    {/* Editar */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleEdit(usuario.id)}
      className="hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 p-1 sm:p-2"
      title="Editar usuario"
    >
      <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </Button>

    {/* Cambiar Rol */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleToggleRole(usuario)}
      className="hover:bg-purple-50 hover:text-purple-600 transition-all duration-200 p-1 sm:p-2"
      title="Cambiar rol"
    >
      {usuario.role === ROLES.ADMIN_PRINCIPAL ? (
        <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      ) : (
        <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      )}
    </Button>

    {/* Eliminar */}
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleDelete(usuario)}
      isLoading={deletingId === usuario.id}
      className="hover:bg-red-50 hover:text-red-600 transition-all duration-200 p-1 sm:p-2"
      title="Eliminar usuario"
    >
      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
    </Button>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};