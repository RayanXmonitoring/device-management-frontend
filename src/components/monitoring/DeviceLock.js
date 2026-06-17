'use client';

import { useState } from 'react';
import { FiLock, FiUnlock, FiAlertCircle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { lockDevice, unlockDevice } from '@/store/slices/deviceSlice';
import toast from 'react-hot-toast';

const DeviceLock = ({ device, onUpdate }) => {
  const [lockMessage, setLockMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLock = async () => {
    if (!device) {
      toast.error('Pilih perangkat terlebih dahulu');
      return;
    }
    try {
      setIsLoading(true);
      await dispatch(lockDevice(device._id)).unwrap();
      toast.success('Perangkat berhasil dikunci!');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Gagal mengunci perangkat');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!device) {
      toast.error('Pilih perangkat terlebih dahulu');
      return;
    }
    try {
      setIsLoading(true);
      await dispatch(unlockDevice(device._id)).unwrap();
      toast.success('Perangkat berhasil dibuka!');
      if (onUpdate) onUpdate();
    } catch (error) {
      toast.error('Gagal membuka perangkat');
    } finally {
      setIsLoading(false);
    }
  };

  if (!device) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400">
        <FiLock className="w-16 h-16 mb-4" />
        <p className="text-lg">Pilih perangkat dari daftar</p>
        <p className="text-sm">Untuk mengunci atau membuka perangkat</p>
      </div>
    );
  }

  const isLockable = device.status === 'online';
  const isUnlockable = device.status === 'maintenance' || device.status === 'lost';

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">{device.name}</h3>
        <p className="text-sm text-gray-500">ID: {device.deviceId}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            device.status === 'online' ? 'bg-green-100 text-green-800' :
            device.status === 'offline' ? 'bg-gray-100 text-gray-800' :
            device.status === 'lost' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {device.status}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 text-yellow-600">
          <FiAlertCircle className="w-5 h-5" />
          <p className="text-sm">
            {device.status === 'maintenance' 
              ? 'Perangkat sedang dalam mode terkunci'
              : device.status === 'lost'
              ? 'Perangkat dalam mode Lost'
              : 'Perangkat dalam keadaan normal'}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {isUnlockable ? (
          <button
            onClick={handleUnlock}
            disabled={isLoading}
            className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg font-medium disabled:opacity-50"
          >
            <FiUnlock className="w-6 h-6" />
            {isLoading ? 'Memproses...' : 'Buka Perangkat'}
          </button>
        ) : isLockable ? (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pesan (Opsional)
              </label>
              <textarea
                value={lockMessage}
                onChange={(e) => setLockMessage(e.target.value)}
                placeholder="Masukkan pesan yang akan ditampilkan saat perangkat dikunci"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleLock}
              disabled={isLoading}
              className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-lg font-medium disabled:opacity-50"
            >
              <FiLock className="w-6 h-6" />
              {isLoading ? 'Memproses...' : 'Kunci Perangkat'}
            </button>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Perangkat tidak dapat dikunci karena sedang offline</p>
          </div>
        )}
      </div>

      {device.lostMode?.active && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
          <h4 className="text-red-800 font-semibold flex items-center gap-2">
            <FiAlertCircle className="w-5 h-5" />
            Lost Mode Aktif
          </h4>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-red-700">
              <span className="font-medium">Pesan:</span> {device.lostMode.message || '-'}
            </p>
            <p className="text-sm text-red-700">
              <span className="font-medium">Kontak:</span> {device.lostMode.contactInfo || '-'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceLock;
