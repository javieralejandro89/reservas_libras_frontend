/**
 * Página de Perfil de Usuario
 */

import { useState } from 'react';
import { User, Lock, Camera, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useProfile } from '@/hooks';
import { useAuthStore } from '@/stores';
import { ROLE_LABELS } from '@/constants';
import clsx from 'clsx';

export const ProfilePage = () => {
  const { user } = useAuthStore();
  const {
    profile,
    isLoading,
    updateProfile,
    isUpdatingProfile,
    changePassword,
    isChangingPassword,
    uploadAvatar,
    isUploadingAvatar,
    deleteAvatar,
    isDeletingAvatar,
  } = useProfile();

  // Estado de formularios
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Estado de mensajes
  const [nameSuccess, setNameSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<{
    score: number;
    label: string;
    color: string;
    requirements: {
      length: boolean;
      lowercase: boolean;
      uppercase: boolean;
      number: boolean;
      special: boolean;
    };
  }>({
    score: 0,
    label: 'Muy débil',
    color: 'bg-red-500',
    requirements: {
      length: false,
      lowercase: false,
      uppercase: false,
      number: false,
      special: false,
    },
  });

  // En desarrollo, las imágenes también pasan por el proxy de Vite
const getAvatarUrl = (avatarPath: string | null | undefined) => {
  if (!avatarPath) return null;
  // avatarPath ya viene con /uploads/avatars/... desde el backend
  // En desarrollo: http://localhost:5173/uploads/avatars/...
  // En producción: http://tudominio.com/uploads/avatars/...
  return avatarPath;
};

  /**
   * Actualizar nombre
   */
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess(false);

    if (!name.trim()) {
      setNameError('El nombre es requerido');
      return;
    }

    try {
      await updateProfile({ name: name.trim() });
      setNameSuccess(true);
      setTimeout(() => setNameSuccess(false), 3000);
    } catch (error: any) {
      setNameError(error.response?.data?.message || 'Error al actualizar nombre');
    }
  };

  /**
   * Cambiar contraseña
   */
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    // Validaciones específicas
    if (!currentPassword) {
      setPasswordError('La contraseña actual es requerida');
      return;
    }

    if (!newPassword) {
      setPasswordError('La nueva contraseña es requerida');
      return;
    }

    if (!confirmPassword) {
      setPasswordError('Debes confirmar la nueva contraseña');
      return;
    }

    // Validar requisitos de contraseña nueva
    const { requirements } = calculatePasswordStrength(newPassword);

    if (!requirements.length) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!requirements.lowercase) {
      setPasswordError('La contraseña debe contener al menos una letra minúscula');
      return;
    }

    if (!requirements.uppercase) {
      setPasswordError('La contraseña debe contener al menos una letra mayúscula');
      return;
    }

    if (!requirements.number) {
      setPasswordError('La contraseña debe contener al menos un número');
      return;
    }

    if (!requirements.special) {
      setPasswordError('La contraseña debe contener al menos un carácter especial (!@#$%^&*...)');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('La nueva contraseña debe ser diferente a la actual');
      return;
    }

    // Llamar a la mutación
    changePassword(
      {
        currentPassword,
        newPassword,
      },
      {
        onSuccess: () => {
          setPasswordSuccess(true);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPasswordStrength({
            score: 0,
            label: 'Muy débil',
            color: 'bg-red-500',
            requirements: {
              length: false,
              lowercase: false,
              uppercase: false,
              number: false,
              special: false,
            },
          });
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || 'Error al cambiar contraseña';
          
          // Mensajes personalizados según el error
          if (errorMessage.includes('incorrecta') || errorMessage.includes('incorrect')) {
            setPasswordError('La contraseña actual es incorrecta');
          } else if (errorMessage.includes('validation') || errorMessage.includes('validación')) {
            setPasswordError('La contraseña no cumple con los requisitos de seguridad');
          } else {
            setPasswordError(errorMessage);
          }
        },
      }
    );
  };

/**
   * Calcular fortaleza de contraseña
   */
  const calculatePasswordStrength = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    let label = 'Muy débil';
    let color = 'bg-red-500';

    if (score === 5) {
      label = 'Muy segura';
      color = 'bg-green-500';
    } else if (score === 4) {
      label = 'Segura';
      color = 'bg-blue-500';
    } else if (score === 3) {
      label = 'Media';
      color = 'bg-yellow-500';
    } else if (score === 2) {
      label = 'Débil';
      color = 'bg-orange-500';
    }

    return { score, label, color, requirements };
  };

  /**
   * Manejar cambio en campo de nueva contraseña
   */
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setNewPassword(password);
    
    if (password) {
      setPasswordStrength(calculatePasswordStrength(password));
    } else {
      setPasswordStrength({
        score: 0,
        label: 'Muy débil',
        color: 'bg-red-500',
        requirements: {
          length: false,
          lowercase: false,
          uppercase: false,
          number: false,
          special: false,
        },
      });
    }
  };
  /**
   * Subir avatar
   */
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Solo se permiten imágenes (JPEG, PNG, GIF, WEBP)');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe superar 5MB');
      return;
    }

    try {
      await uploadAvatar(file);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al subir avatar');
    }
  };

  /**
   * Eliminar avatar
   */
  const handleDeleteAvatar = async () => {
    if (!confirm('¿Estás seguro de eliminar tu foto de perfil?')) return;

    try {
      await deleteAvatar();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error al eliminar avatar');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="mt-2 text-sm text-gray-600">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="space-y-6">
        {/* Sección Avatar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-blue-600" />
            Foto de Perfil
          </h2>

          <div className="flex items-center gap-6">
            {/* Avatar actual */}
            <div className="relative">
              {user?.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar) || ''}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl font-bold border-4 border-blue-100">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              )}
              
              {isUploadingAvatar && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex-1">
              <p className="text-sm text-gray-600 mb-3">
                Formatos: JPG, PNG, GIF, WEBP. Tamaño máximo: 5MB
              </p>
              
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <Camera className="w-4 h-4" />
                    {user?.avatar ? 'Cambiar foto' : 'Subir foto'}
                  </span>
                </label>

                {user?.avatar && (
                  <button
                    onClick={handleDeleteAvatar}
                    disabled={isDeletingAvatar}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información de la cuenta */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Información de la Cuenta
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">
                El email no puede ser modificado
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <input
                type="text"
                value={user ? ROLE_LABELS[user.role] : ''}
                disabled
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {profile?._count && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total de Reservas
                </label>
                <input
                  type="text"
                  value={profile._count.reservas}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actualizar nombre */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Actualizar Nombre
          </h2>

          <form onSubmit={handleUpdateName} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
              />
            </div>

            {nameError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{nameError}</span>
              </div>
            )}

            {nameSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Nombre actualizado exitosamente</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isUpdatingProfile}
              className={clsx(
                'w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors',
                isUpdatingProfile
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              )}
            >
              <Save className="w-4 h-4" />
              {isUpdatingProfile ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </form>
        </div>

        {/* Cambiar contraseña */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Cambiar Contraseña
          </h2>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña actual
              </label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu contraseña actual"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Nueva contraseña
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Mínimo 8 caracteres"
              />
            </div>

            {/* Indicador de fortaleza */}
            {newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 font-medium">Fortaleza de la contraseña:</span>
                  <span className={clsx(
                    'font-semibold',
                    passwordStrength.score === 5 && 'text-green-600',
                    passwordStrength.score === 4 && 'text-blue-600',
                    passwordStrength.score === 3 && 'text-yellow-600',
                    passwordStrength.score <= 2 && 'text-red-600'
                  )}>
                    {passwordStrength.label}
                  </span>
                </div>

                {/* Barra de progreso */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={clsx(
                      'h-full transition-all duration-300',
                      passwordStrength.color
                    )}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>

                {/* Requisitos */}
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className={clsx(
                    'flex items-center gap-1.5',
                    passwordStrength.requirements.length ? 'text-green-600' : 'text-gray-400'
                  )}>
                    <div className={clsx(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      passwordStrength.requirements.length ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      {passwordStrength.requirements.length ? '✓' : '○'}
                    </div>
                    <span>Al menos 8 caracteres</span>
                  </div>

                  <div className={clsx(
                    'flex items-center gap-1.5',
                    passwordStrength.requirements.lowercase ? 'text-green-600' : 'text-gray-400'
                  )}>
                    <div className={clsx(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      passwordStrength.requirements.lowercase ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      {passwordStrength.requirements.lowercase ? '✓' : '○'}
                    </div>
                    <span>Una letra minúscula (a-z)</span>
                  </div>

                  <div className={clsx(
                    'flex items-center gap-1.5',
                    passwordStrength.requirements.uppercase ? 'text-green-600' : 'text-gray-400'
                  )}>
                    <div className={clsx(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      passwordStrength.requirements.uppercase ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      {passwordStrength.requirements.uppercase ? '✓' : '○'}
                    </div>
                    <span>Una letra mayúscula (A-Z)</span>
                  </div>

                  <div className={clsx(
                    'flex items-center gap-1.5',
                    passwordStrength.requirements.number ? 'text-green-600' : 'text-gray-400'
                  )}>
                    <div className={clsx(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      passwordStrength.requirements.number ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      {passwordStrength.requirements.number ? '✓' : '○'}
                    </div>
                    <span>Un número (0-9)</span>
                  </div>

                  <div className={clsx(
                    'flex items-center gap-1.5',
                    passwordStrength.requirements.special ? 'text-green-600' : 'text-gray-400'
                  )}>
                    <div className={clsx(
                      'w-4 h-4 rounded-full flex items-center justify-center',
                      passwordStrength.requirements.special ? 'bg-green-100' : 'bg-gray-100'
                    )}>
                      {passwordStrength.requirements.special ? '✓' : '○'}
                    </div>
                    <span>Un carácter especial (!@#$%...)</span>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar nueva contraseña
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Repite la nueva contraseña"
              />
            </div>

            {passwordError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>Contraseña actualizada. Redirigiendo al login...</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isChangingPassword}
              className={clsx(
                'w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition-colors',
                isChangingPassword
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-700'
              )}
            >
              <Lock className="w-4 h-4" />
              {isChangingPassword ? 'Cambiando...' : 'Cambiar Contraseña'}
            </button>

            <p className="text-xs text-gray-500">
              Nota: Después de cambiar tu contraseña, deberás iniciar sesión nuevamente.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};