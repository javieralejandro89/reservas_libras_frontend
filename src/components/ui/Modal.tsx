/**
 * Componente Modal
 */

import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
}: ModalProps) => {
  // Cerrar con ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
  <div
    className={clsx(
      'relative bg-white rounded-lg shadow-xl w-full mx-auto',
      sizes[size]
    )}
    onClick={(e) => e.stopPropagation()}
  >
          {/* Header */}
          {(title || showCloseButton) && (
  <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
    {title && (
      <h2 className="text-base sm:text-xl font-semibold text-gray-900 pr-2">{title}</h2>
    )}
    {showCloseButton && (
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
      >
        <X className="w-5 h-5" />
      </button>
    )}
  </div>
)}

          {/* Content */}
          <div className="px-3 sm:px-6 py-3 sm:py-4">{children}</div>
        </div>
      </div>
    </div>
  );
};