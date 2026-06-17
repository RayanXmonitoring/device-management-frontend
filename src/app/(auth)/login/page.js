'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '@/store/slices/authSlice';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function LoginPage() {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin] = useState('');
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated, pinVerified } = useSelector((state) => state.auth);
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (isAuthenticated && pinVerified) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, pinVerified, router]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      toast.success('Login berhasil!');
    } catch (error) {
      toast.error(error || 'Login gagal. Silakan coba lagi.');
    }
  };

  const handlePinSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(verifyPin(pin)).unwrap();
      toast.success('PIN diverifikasi!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('PIN salah. Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Device Management</h1>
          <p className="text-gray-600 mt-2">Sistem Monitoring Perangkat</p>
        </div>

        {!showPin ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email tidak valid'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password wajib diisi',
                  minLength: {
                    value: 6,
                    message: 'Password minimal 6 karakter'
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>
              <button
                type="button"
                onClick={() => setShowPin(true)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Login dengan PIN
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Memproses...' : 'Login'}
            </button>

            <div className="text-center mt-4">
              <Link href="/register" className="text-sm text-blue-600 hover:text-blue-500">
                Belum punya akun? Daftar di sini
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePinSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PIN Akses
              </label>
              <input
                type="password"
                maxLength="6"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl"
                placeholder="Masukkan PIN 6 digit"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowPin(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Kembali
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Verifikasi
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Device Management System. All rights reserved.
        </div>
      </div>
    </div>
  );
}
