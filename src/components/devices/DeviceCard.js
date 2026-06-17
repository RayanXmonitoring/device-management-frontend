'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { FiEye, FiLock, FiUnlock, FiAlertTriangle, FiMoreVertical, FiEdit2 } from 'react-icons/fi';
import { lockDevice, unlockDevice, setLostMode } from '@/store/slices/deviceSlice';
import toast from 'react-hot-toast';
import Image from 'next/image';

const DeviceCard = ({ device }) => {
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'lost': return 'bg-red-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'lost': return 'Lost Mode';
      case 'maintenance': return 'Maintenance';
      default: return 'Unknown';
    }
  };

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'android':
        return '/icons/android.svg';
      case 'ios':
        return '/icons/ios.svg';
      case 'windows':
        return '/icons/windows.svg';
      case 'macos':
        return '/icons/macos.svg';
      default:
        return '/icons/device.svg';
    }
  };

  const handleLock = async () => {
    try {
      await dispatch(lockDevice(device._id)).unwrap();
      toast.success('Perangkat berhasil dikunci!');
      setShowMenu(false);
    } catch (error) {
      toast.error('Gagal mengunci perangkat');
    }
  };

  const handleUnlock = async () => {
    try {
      await dispatch(unlockDevice(device._id)).unwrap();
      toast.success('Perangkat berhasil dibuka!');
      setShowMenu(false);
    } catch (error) {
      toast.error('Gagal membuka perangkat');
    }
  };

  const handleLostMode = async () => {
    try {
      await dispatch(setLostMode(device._id)).unwrap();
      toast.success('Lost mode berhasil diaktifkan!');
      setShowMenu(false);
    } catch (error) {
      toast.error('Gagal mengaktifkan lost mode');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes}m lalu`;
    if (hours < 24) return `${hours}j lalu`;
    if (days < 7) return `${days}h lalu`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src={getDeviceIcon(device.type)}
                alt={device.type}
                width={40}
                height={40}
                className="rounded-lg"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${getStatusColor(device.status)} border-2 border-white`}></div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 truncate max-w-[120px]">
                {device.name}
              </h3>
              <p className="text-xs text-gray-500">{device.deviceId}</p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <FiMoreVertical className="w-5 h-5 text-gray-400" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={() => {
                    router.push(`/devices/${device._id}`);
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <FiEye className="w-4 h-4" />
                  Detail
                </button>
                {device.status !== 'lost' && (
                  <>
                    <button
                      onClick={handleLock}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FiLock className="w-4 h-4" />
                      Kunci
                    </button>
                    <button
                      onClick={handleLostMode}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiAlertTriangle className="w-4 h-4" />
                      Lost Mode
                    </button>
                  </>
                )}
                {device.status === 'lost' && (
                  <button
                    onClick={handleUnlock}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                  >
                    <FiUnlock className="w-4 h-4" />
                    Buka
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Status</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              device.status === 'online' ? 'bg-green-100 text-green-800' :
              device.status === 'offline' ? 'bg-gray-100 text-gray-800' :
              device.status === 'lost' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {getStatusText(device.status)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Tipe</span>
            <span className="capitalize">{device.type}</span>
          </div>
          {device.battery && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Baterai</span>
              <span className="flex items-center gap-1">
                <span className={`font-medium ${
                  device.battery.level > 50 ? 'text-green-600' :
                  device.battery.level > 20 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {device.battery.level}%
                </span>
                {device.battery.isCharging && (
                  <span className="text-xs text-green-600">⚡</span>
                )}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Terakhir Aktif</span>
            <span className="text-xs">{formatDate(device.lastSeen)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
          <button
            onClick={() => router.push(`/devices/${device._id}`)}
            className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
          >
            Detail
          </button>
          {device.status !== 'lost' && device.status !== 'maintenance' ? (
            <button
              onClick={handleLock}
              className="px-3 py-1.5 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm font-medium"
            >
              <FiLock className="w-4 h-4" />
            </button>
          ) : device.status === 'lost' ? (
            <button
              onClick={handleUnlock}
              className="px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
            >
              <FiUnlock className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default DeviceCard;
