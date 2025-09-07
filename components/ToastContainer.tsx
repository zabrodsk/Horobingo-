import React, { useEffect } from 'react';
import type { ToastMessage } from '../types';
import Toast from './Toast';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  useEffect(() => {
    const timers = toasts.map(toast => {
      return setTimeout(() => {
        onDismiss(toast.id);
      }, 5000); // Auto-dismiss after 5 seconds
    });

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts, onDismiss]);

  return (
    <div
      className="fixed bottom-4 right-4 w-auto max-w-sm space-y-2 z-50"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

export default ToastContainer;
