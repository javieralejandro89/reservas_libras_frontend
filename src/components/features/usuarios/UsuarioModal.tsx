/**
 * Modal de Crear/Editar Usuario
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, Input, Button, Select } from '@/components/ui';
import { useUIStore } from '@/stores';
import { useUsers } from '@/hooks';
import { ROLES, ROLE_LABELS, VALIDATION_RULES } from '@/constants';
import toast from 'react-hot-toast';
import { Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import type { CreateUserDTO, UpdateUserDTO } from '@/types';
import { AxiosError } from 'axios';

const userSchema = z.object({
  name: z
    .string()
    .min(VALIDATION_RULES.NAME.MIN_LENGTH, `Mínimo ${VALIDATION_RULES.NAME.MIN_LENGTH} caracteres`)
    .max(VALIDATION_RULES.NAME.MAX_LENGTH, `Máximo ${VALIDATION_RULES.NAME.MAX_LENGTH} caracteres`),
  email: z
    .string()
    .email('Email inválido')
    .min(1, 'El email es requerido'),
  password: z
    .string()
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, `Mínimo ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`)
    .regex(/[a-z]/, 'Debe contener al menos una minúscula')
    .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe contener al menos un número')
    .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial')
    .optional()
    .or(z.literal('')),
  role: z.enum([ROLES.ADMIN_PRINCIPAL, ROLES.USUARIO]),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

export const UsuarioModal = () => {
  const { isUserModalOpen, userModalMode, userModalId, closeUserModal } = useUIStore();
  const { createUser, isCreating, updateUser, isUpdating, useUserById } = useUsers();
  const { data: userData } = useUserById(userModalId);
  
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: ROLES.USUARIO,
      isActive: true,
    },
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (userModalMode === 'edit' && userData) {
      setValue('name', userData.name);
      setValue('email', userData.email);
      setValue('role', userData.role);
      setValue('isActive', userData.isActive);
      setValue('password', '');
    } else if (userModalMode === 'create') {
      reset({
        role: ROLES.USUARIO,
        isActive: true,
      });
    }
  }, [userModalMode, userData, setValue, reset]);

  // Validaciones en tiempo real
  const passwordChecks = {
    length: passwordValue.length >= VALIDATION_RULES.PASSWORD.MIN_LENGTH,
    lowercase: /[a-z]/.test(passwordValue),
    uppercase: /[A-Z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
    special: /[^a-zA-Z0-9]/.test(passwordValue),
  };

  const onSubmit = (formData: UserFormData) => {
    if (userModalMode === 'create') {
      // Validar que la contraseña esté presente en modo crear
      if (!formData.password) {
        toast.error('La contraseña es requerida');
        return;
      }

      const createPayload: CreateUserDTO = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      createUser(createPayload, {
        onSuccess: () => {
          toast.success('Usuario creado correctamente');
          closeUserModal();
          reset();
          setPasswordValue('');
        },
        onError: (error: AxiosError<{ message?: string }>) => {
          toast.error(error.response?.data?.message || 'Error al crear usuario');
        },
      });
    } else if (userModalMode === 'edit' && userModalId) {
      const updatePayload: UpdateUserDTO = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        isActive: formData.isActive,
        ...(formData.password && { password: formData.password }),
      };

      updateUser(
        { 
          userId: userModalId, 
          data: updatePayload,
        },
        {
          onSuccess: () => {
            toast.success('Usuario actualizado correctamente');
            closeUserModal();
            reset();
            setPasswordValue('');
          },
          onError: (error: AxiosError<{ message?: string }>) => {
            toast.error(error.response?.data?.message || 'Error al actualizar usuario');
          },
        }
      );
    }
  };

  const handleClose = () => {
    closeUserModal();
    reset();
    setPasswordValue('');
    setShowPassword(false);
  };

  // Opciones de rol
  const roleOptions = Object.entries(ROLE_LABELS).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <Modal
      isOpen={isUserModalOpen}
      onClose={handleClose}
      title={userModalMode === 'create' ? 'Nuevo Usuario' : 'Editar Usuario'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Nombre */}
        <Input
          {...register('name')}
          type="text"
          label="Nombre Completo"
          placeholder="Juan Pérez"
          error={errors.name?.message}
          required
        />

        {/* Email */}
        <Input
          {...register('email')}
          type="email"
          label="Correo Electrónico"
          placeholder="usuario@ejemplo.com"
          error={errors.email?.message}
          required
          disabled={userModalMode === 'edit'}
          helperText={userModalMode === 'edit' ? 'El email no puede ser modificado' : undefined}
        />

        {/* Contraseña */}
        <div>
          <div className="relative">
            <Input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              label="Contraseña"
              placeholder={userModalMode === 'edit' ? 'Dejar vacío para no cambiar' : '••••••••'}
              error={errors.password?.message}
              required={userModalMode === 'create'}
              onChange={(e) => {
                setPasswordValue(e.target.value);
                register('password').onChange(e);
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Requisitos de contraseña (solo si se está escribiendo) */}
          {(passwordValue || userModalMode === 'create') && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-2">
              <p className="text-xs font-medium text-gray-700 mb-2">
                Requisitos de contraseña:
              </p>
              <div className="space-y-1.5">
                {[
                  { check: passwordChecks.length, text: 'Mínimo 8 caracteres' },
                  { check: passwordChecks.lowercase, text: 'Una letra minúscula' },
                  { check: passwordChecks.uppercase, text: 'Una letra mayúscula' },
                  { check: passwordChecks.number, text: 'Un número' },
                  { check: passwordChecks.special, text: 'Un carácter especial' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.check ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-xs transition-colors ${
                        item.check ? 'text-green-700 font-medium' : 'text-gray-600'
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Grid para Rol y Estado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Rol */}
          <Select
            {...register('role')}
            label="Rol"
            error={errors.role?.message}
            required
            options={roleOptions}
          />

          {/* Estado Activo (solo en edición) */}
          {userModalMode === 'edit' && (
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <label className="relative inline-flex items-center cursor-pointer h-[42px]">
                <input
                  {...register('isActive')}
                  type="checkbox"
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                <span className="ms-3 text-sm font-medium text-gray-700">
                  {watch('isActive') ? 'Activo' : 'Inactivo'}
                </span>
              </label>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isCreating || isUpdating}
            className="w-full sm:w-auto"
          >
            {userModalMode === 'create' ? 'Crear' : 'Guardar'} Usuario
          </Button>
        </div>
      </form>
    </Modal>
  );
};