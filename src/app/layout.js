'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>Device Management System</title>
        <meta name="description" content="Sistem Manajemen dan Monitoring Perangkat" />
      </head>
      <body>
        <Provider store={store}>
          {children}
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}
