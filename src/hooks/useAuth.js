'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { loginUser, logout, setUser } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get token
          const token = await firebaseUser.getIdToken();
          localStorage.setItem('authToken', token);
          
          // Get user data from backend
          // This will be handled by the login action
        } else {
          // User is signed out
          dispatch(logout());
        }
      } catch (error) {
        console.error('Auth state change error:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const login = async (email, password) => {
    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      toast.success('Login berhasil!');
      router.push('/dashboard');
      return result;
    } catch (error) {
      toast.error(error || 'Login gagal');
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await dispatch(logout());
      router.push('/login');
      toast.success('Logout berhasil!');
    } catch (error) {
      toast.error('Logout gagal');
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout: logoutUser,
  };
};
