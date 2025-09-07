import React from 'react';
import type { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: number) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const bgColor = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    error: 'bg-red-500',
  }[toast.type];

  return (
    <div
      className={`w-full max-w-sm p-4 rounded-lg shadow-lg text-white ${bgColor}`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between">
        <span>{toast.message}</span>
        <button onClick={() => onDismiss(toast.id)} className="ml-4 p-1 rounded-full hover:bg-black/20 focus:outline-none focus:ring-2 focus:ring-white">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
    </div>
  );
};

export default Toast;
