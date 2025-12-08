/**
 * Componente Sidebar
 */

import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, Calendar, Users, History, X, TrendingUp } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/stores';
import { ROUTES, ROLES } from '@/constants';
import clsx from 'clsx';

export const Sidebar = () => {
  const { user } = useAuthStore();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();

  const isAdmin = user?.role === ROLES.ADMIN_PRINCIPAL;

  const navigation = [
    {
      name: 'Dashboard',
      href: ROUTES.DASHBOARD,
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: 'Reservas',
      href: ROUTES.RESERVAS,
      icon: Package,
      show: true,
    },
    {
      name: 'Periodos',
      href: ROUTES.PERIODOS,
      icon: Calendar,
      show: isAdmin,
    },
    {
      name: 'Reportes',
      href: ROUTES.REPORTES,
      icon: TrendingUp,
      show: isAdmin,
    },
    {
      name: 'Usuarios',
      href: ROUTES.USUARIOS,
      icon: Users,
      show: isAdmin,
    },
    {
      name: 'Histórico',
      href: ROUTES.HISTORICO,
      icon: History,
      show: true,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
  className={clsx(
    'fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform duration-300 ease-in-out bg-white border-r border-gray-200',
    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
  )}
>
        {/* Close button (mobile) */}
        <button
  onClick={() => setSidebarOpen(false)}
  className="absolute top-2 right-4 lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110 active:scale-95"
>
          <X className="w-5 h-5" />
        </button>

        <div className="h-full px-3 pb-4 overflow-y-auto">
          <nav className="space-y-1">
            {navigation.map((item) => {
              if (!item.show) return null;

              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    clsx(
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out',
                      'relative overflow-hidden',
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg shadow-primary-500/50 scale-105'
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:scale-102 hover:shadow-md'
                    )
                  }
                  onClick={() => {
                    // Cerrar sidebar en mobile
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                >
                  {/* Efecto de brillo en hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out" />
                  
                  {/* Icono */}
                  <item.icon className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3" />
                  
                  {/* Texto */}
                  <span className="relative z-10">{item.name}</span>
                  
                  {/* Indicador activo */}
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full opacity-0 group-[.active]:opacity-100 transition-opacity duration-200" />
                </NavLink>
              );
            })}
          </nav>

          {/* Decoración inferior */}
          <div className="mt-8 px-4">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          </div>
        </div>
      </aside>
    </>
  );
};