import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster, toast, resolveValue } from 'react-hot-toast';
import { router } from './routes';
import { queryClient } from './lib/react-query';
import AuthBootstrap from './components/auth/AuthBootstrap';
import { X } from 'lucide-react';
import { cn } from './utils/cn';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthBootstrap>
        <RouterProvider router={router} />
      </AuthBootstrap>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: 'react-hot-toast-custom',
          style: {
            background: '#1A2B3D',
            color: '#fff',
            borderRadius: '1rem',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        }}
      >
        {(t) => (
          <div
            className={cn(
              "flex items-center gap-3 bg-[#1A2B3D] text-white px-4 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in fade-in slide-in-from-top-2 duration-300",
              t.visible ? "opacity-100" : "opacity-0"
            )}
          >
            <div className="flex-1">{resolveValue(t.message, t)}</div>
            <button 
              onClick={() => toast.dismiss(t.id)}
              className="p-1 hover:bg-white/10 rounded-lg transition-colors text-white/40 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}
      </Toaster>
    </QueryClientProvider>
  );
}

export default App;
