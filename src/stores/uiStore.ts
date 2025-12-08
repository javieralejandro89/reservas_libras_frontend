/**
 * Store de UI
 */

import { create } from 'zustand';

interface UIState {
  // Sidebar
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Modal de crear/editar reserva
  isReservaModalOpen: boolean;
  reservaModalMode: 'create' | 'edit';
  reservaModalId: number | null;
  openReservaModal: (mode: 'create' | 'edit', reservaId?: number) => void;
  closeReservaModal: () => void;

  // Modal de crear/editar periodo
  isPeriodoModalOpen: boolean;
  periodoModalMode: 'create' | 'edit';
  periodoModalId: number | null;
  openPeriodoModal: (mode: 'create' | 'edit', periodoId?: number) => void;
  closePeriodoModal: () => void;

  // Modal de crear/editar usuario
  isUserModalOpen: boolean;
  userModalMode: 'create' | 'edit';
  userModalId: number | null;
  openUserModal: (mode: 'create' | 'edit', userId?: number) => void;
  closeUserModal: () => void;

  // Modal de confirmación genérica
  isConfirmModalOpen: boolean;
  confirmModalData: {
    title: string;
    message: string;
    confirmText: string;
    onConfirm: () => void;
  } | null;
  openConfirmModal: (data: {
    title: string;
    message: string;
    confirmText?: string;
    onConfirm: () => void;
  }) => void;
  closeConfirmModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  // Sidebar
  isSidebarOpen: true,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  // Modal de reserva
  isReservaModalOpen: false,
  reservaModalMode: 'create',
  reservaModalId: null,
  openReservaModal: (mode, reservaId) =>
    set({
      isReservaModalOpen: true,
      reservaModalMode: mode,
      reservaModalId: reservaId || null,
    }),
  closeReservaModal: () =>
    set({
      isReservaModalOpen: false,
      reservaModalId: null,
    }),

  // Modal de periodo
  isPeriodoModalOpen: false,
  periodoModalMode: 'create',
  periodoModalId: null,
  openPeriodoModal: (mode, periodoId) =>
    set({
      isPeriodoModalOpen: true,
      periodoModalMode: mode,
      periodoModalId: periodoId || null,
    }),
  closePeriodoModal: () =>
    set({
      isPeriodoModalOpen: false,
      periodoModalId: null,
    }),

  // Modal de usuario
  isUserModalOpen: false,
  userModalMode: 'create',
  userModalId: null,
  openUserModal: (mode, userId) =>
    set({
      isUserModalOpen: true,
      userModalMode: mode,
      userModalId: userId || null,
    }),
  closeUserModal: () =>
    set({
      isUserModalOpen: false,
      userModalId: null,
    }),

  // Modal de confirmación
  isConfirmModalOpen: false,
  confirmModalData: null,
  openConfirmModal: (data) =>
    set({
      isConfirmModalOpen: true,
      confirmModalData: {
        title: data.title,
        message: data.message,
        confirmText: data.confirmText || 'Confirmar',
        onConfirm: data.onConfirm,
      },
    }),
  closeConfirmModal: () =>
    set({
      isConfirmModalOpen: false,
      confirmModalData: null,
    }),
}));