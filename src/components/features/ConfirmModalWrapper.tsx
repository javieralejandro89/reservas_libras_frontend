/**
 * Wrapper para conectar ConfirmModal con el store de UI
 */

import { ConfirmModal } from './ConfirmModal';
import { useUIStore } from '@/stores';

export const ConfirmModalWrapper = () => {
  const { isConfirmModalOpen, confirmModalData, closeConfirmModal } = useUIStore();

  if (!confirmModalData) return null;

  const handleConfirm = () => {
    // Ejecutar la acción
    confirmModalData.onConfirm();
    // Cerrar el modal inmediatamente
    closeConfirmModal();
  };

  return (
    <ConfirmModal
      isOpen={isConfirmModalOpen}
      onClose={closeConfirmModal}
      onConfirm={handleConfirm}
      title={confirmModalData.title}
      message={confirmModalData.message}
      confirmText={confirmModalData.confirmText}
    />
  );
};