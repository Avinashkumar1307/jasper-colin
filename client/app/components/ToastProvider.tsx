'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#1e293b',
          color: '#f1f5f9',
          borderRadius: '12px',
          padding: '14px 20px',
          fontSize: '14px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        },
        success: {
          iconTheme: {
            primary: '#22c55e',
            secondary: '#f0fdf4',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fef2f2',
          },
          duration: 4000,
        },
      }}
    />
  );
}
