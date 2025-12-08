/**
 * Página de Login
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '@/hooks';
import { Button, Input, Card } from '@/components/ui';
import { VALIDATION_RULES } from '@/constants';
import { LoginDTO } from '@/types';

// Schema de validación
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Email inválido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(VALIDATION_RULES.PASSWORD.MIN_LENGTH, `Mínimo ${VALIDATION_RULES.PASSWORD.MIN_LENGTH} caracteres`),
});

export const LoginPage = () => {
  const { login, isLoggingIn, loginError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDTO>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginDTO) => {
    login(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 px-4">
      <Card className="w-full max-w-md" padding="lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bienvenido
          </h1>
          <p className="text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>

        {/* Error general */}
        {loginError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              {loginError.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.'}
            </p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              className="pl-10"
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
            <Input
              {...register('password')}
              type="password"
              label="Contraseña"
              placeholder="••••••••"
              error={errors.password?.message}
              className="pl-10"
              autoComplete="current-password"
              required
            />
          </div>

          {/* Submit */}
          <Button
            type="submit"
            fullWidth
            isLoading={isLoggingIn}
          >
            Iniciar Sesión
          </Button>
        </form>        
        
      </Card>
    </div>
  );
};