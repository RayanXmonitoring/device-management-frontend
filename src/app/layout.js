'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import { SessionProvider } from 'next-auth/react';
import '@/styles/globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>Device Management System</title>
        <meta name="description" content="Sistem Manajemen dan Monitoring Perangkat" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <Provider store={store}>
          <SessionProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
              }}
            />
          </SessionProvider>
        </Provider>
      </body>
    </html>
  );
}
