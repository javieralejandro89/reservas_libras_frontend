/**
 * Layout Principal
 */

import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores';
import { useAuth } from '@/hooks';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Spinner } from '@/components/ui';

export const MainLayout = () => {
  const { user, setUser } = useAuthStore();
  const { refetchProfile, isLoadingProfile } = useAuth();

  // Cargar perfil del usuario al montar
  useEffect(() => {
    const loadProfile = async () => {
      const result = await refetchProfile();
      if (result.data) {
        setUser(result.data);
      }
    };

    if (!user) {
      loadProfile();
    }
  }, [user, refetchProfile, setUser]);

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="flex">
        <Sidebar />
        {/* Main Content - Ajustado padding-top para navbar (h-16 = 4rem = pt-16) */}
        <main className="flex-1 pt-20 pb-6 px-4 sm:px-6 ml-0 lg:ml-64 min-h-screen transition-all duration-300 ease-in-out">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};