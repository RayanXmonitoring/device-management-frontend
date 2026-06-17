'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
  FiMenu,
  FiChevronDown,
} from 'react-icons/fi';
import { useNotifications } from '@/hooks/useNotifications';
import toast from 'react-hot-toast';

const Navbar = ({ user, onLogout, toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const router = useRouter();
  const { unreadCount, notifications, markAsRead } = useNotifications();

  const handleLogout = async () => {
    try {
      await onLogout();
      toast.success('Logout berhasil!');
      router.push('/login');
    } catch (error) {
      toast.error('Gagal logout');
    }
  };

  const handleNotificationClick = async (notificationId) => {
    await markAsRead(notificationId);
    // Handle notification click based on type
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return new Date(date).toLocaleDateString();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <FiMenu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-800">
              Device Management System
            </h1>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
            >
              <FiBell className="w-6 h-6 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="p-4 text-center text-gray-500 text-sm">
                      Tidak ada notifikasi
                    </p>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification._id)}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                      >
                        <p className="text-sm font-medium text-gray-800">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-2 border-t border-gray-200">
                    <button
                      onClick={() => {
                        // Mark all as read
                      }}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      Tandai semua telah dibaca
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user?.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {user?.name ? getInitials(user.name) : 'U'}
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {user?.name || 'User'}
              </span>
              <FiChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-3 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-600">
                    {user?.role || 'User'}
                  </span>
                </div>
                <div className="py-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FiUser className="w-4 h-4" />
                    Profil
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FiSettings className="w-4 h-4" />
                    Pengaturan
                  </Link>
                  <Link
                    href="/help"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <FiHelpCircle className="w-4 h-4" />
                    Bantuan
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <FiLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
