import { ToastType } from './models/toast';
import { useToast as useToastContext } from './toast.context';

export const useToast = () => {
  const { addToast } = useToastContext();

  const showToast = (message: string, type: ToastType = 'info', duration = 3000) => {
    addToast({ message, type, duration });
  };

  return { showToast };
};
