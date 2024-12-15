'use client';

import { ToastType } from './models/toast';
import { useToastContext } from './toast.context';

export const useToast = () => {
  const { addToast } = useToastContext();

  const showToast = (message: string, type: ToastType = 'info', duration = 5000) => {
    addToast({ message, type, duration });
  };

  return { showToast };
};
