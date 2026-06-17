'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiMonitor,
  FiGrid,
  FiMessageSquare,
  FiCamera,
  FiEye,
  FiLock,
  FiUsers,
  FiSettings,
  FiUserCheck,
  FiFileText,
  FiChevronLeft,
  FiChevronRight,
  FiImage,
} from 'react-icons/fi';

const Sidebar = ({ isOpen, setIsOpen, userRole }) => {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  const isAdmin = userRole === 'admin';
  const isReseller = userRole === 'reseller';

  const navItems = [
    {
      section: 'Dashboard',
      items: [
        { href: '/dashboard', icon: FiHome, label: 'Dashboard' },
        { href: '/devices', icon: FiMonitor, label: 'Perangkat' },
      ],
    },
    {
      section: 'Monitoring',
      items: [
        { href: '/monitoring/live-camera', icon: FiCamera, label: 'Live Camera' },
        { href: '/monitoring/live-screen', icon: FiEye, label: 'Live Screen' },
        { href: '/monitoring/device-lock', icon: FiLock, label: 'Device Lock' },
        { href: '/gallery', icon: FiImage, label: 'Gallery' },
        { href: '/sms', icon: FiMessageSquare, label: 'SMS' },
      ],
    },
    ...((isAdmin || isReseller) ? [{
      section: 'Administrasi',
      items: [
        ...(isAdmin ? [
          { href: '/admin/users', icon: FiUsers, label: 'Kelola User' },
          { href: '/admin/roles', icon: FiUserCheck, label: 'Manajemen Role' },
        ] : []),
        { href: '/admin/licenses', icon: FiFileText, label: 'Lisensi' },
        { href: '/admin/settings', icon: FiSettings, label: 'Pengaturan' },
      ],
    }] : []),
  ];

  const isActive = (href) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      } flex flex-col h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className={`flex items-center gap-2 ${!isOpen && 'justify-center w-full'}`}>
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">
            DM
          </div>
          {isOpen && <span className="font-semibold text-lg">Device Manager</span>}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 rounded-lg hover:bg-gray-800 transition-colors"
        >
          {isOpen ? <FiChevronLeft className="w-5 h-5" /> : <FiChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        {navItems.map((section, idx) => (
          <div key={idx}>
            {isOpen && (
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
                {section.section}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      active
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    } ${!isOpen && 'justify-center'}`}
                    title={!isOpen ? item.label : ''}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className={`flex items-center gap-3 ${!isOpen && 'justify-center'}`}>
          <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">
              {isOpen ? 'V1.0' : 'V1'}
            </span>
          </div>
          {isOpen && (
            <div>
              <p className="text-sm font-medium">v1.0.0</p>
              <p className="text-xs text-gray-400">Production</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
