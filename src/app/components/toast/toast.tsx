import React, { useEffect } from 'react';
import { useToast } from './toast.context';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  useEffect(() => {
    toasts.forEach(toast => {
      if (toast.duration) {
        const timer = setTimeout(() => removeToast(toast.id), toast.duration);
        return () => clearTimeout(timer);
      }
    });
  }, [toasts, removeToast]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.message}
          <button onClick={() => removeToast(toast.id)}>✖</button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
