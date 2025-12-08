/**
 * Navbar Moderno
 */

import { useState, useRef, useEffect } from 'react';
import { Menu, LogOut, User, ChevronDown, Package } from 'lucide-react';
import { useAuthStore, useUIStore } from '@/stores';
import { useAuth } from '@/hooks';
import { getInitials } from '@/utils/format';
import { ROLE_LABELS } from '@/constants';
import clsx from 'clsx';

export const Navbar = () => {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const { logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            {/* Menu Toggle (Mobile) */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md group"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5 text-gray-700 group-hover:text-primary-600 transition-colors" />
            </button>

            {/* Logo + Title */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-gray-900 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Sistema de Reservas
                </h1>
                <p className="text-xs text-gray-500">Gestión de Paquetería</p>
              </div>
              
              {/* Mobile Title */}
              <h1 className="sm:hidden text-lg font-bold text-gray-900">
                Reservas
              </h1>
            </div>
          </div>

          {/* Right Section */}
          {user && (
            <div className="flex items-center gap-3" ref={dropdownRef}>
              {/* User Info (Hidden on small screens) */}
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
              </div>

              {/* User Menu Button */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="relative flex items-center gap-2 p-1 pr-3 rounded-xl hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100 transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-md group"
              >
                {/* Avatar */}
                <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/30 group-hover:shadow-xl group-hover:shadow-primary-500/40 transition-all duration-200">
                  {getInitials(user.name)}
                </div>

                {/* Chevron (Hidden on mobile) */}
                <ChevronDown
                  className={clsx(
                    'hidden sm:block w-4 h-4 text-gray-500 transition-transform duration-200',
                    isDropdownOpen && 'rotate-180'
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              <div
                className={clsx(
                  'absolute top-full right-4 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 transition-all duration-200 origin-top-right',
                  isDropdownOpen
                    ? 'opacity-100 scale-100 visible'
                    : 'opacity-0 scale-95 invisible'
                )}
              >
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 text-white font-semibold shadow-md">
                      {getInitials(user.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mt-1">
                        {ROLE_LABELS[user.role]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      // TODO: Navigate to profile
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 transition-all duration-150 group"
                  >
                    <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-primary-100 transition-colors">
                      <User className="w-4 h-4 text-gray-600 group-hover:text-primary-600 transition-colors" />
                    </div>
                    <span className="font-medium">Mi Perfil</span>
                  </button>
                </div>

                {/* Divider */}
                <div className="my-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* Logout */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-all duration-150 group"
                  >
                    <div className="p-1.5 rounded-lg bg-red-50 group-hover:bg-red-100 transition-colors">
                      <LogOut className="w-4 h-4" />
                    </div>
                    <span className="font-medium">Cerrar Sesión</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};