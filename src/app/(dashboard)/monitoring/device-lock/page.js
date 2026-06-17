'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices, lockDevice, unlockDevice } from '@/store/slices/deviceSlice';
import { FiLock, FiUnlock, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';

export default function DeviceLockPage() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [lockMessage, setLockMessage] = useState('');
  const dispatch = useDispatch();
  const { devices, isLoading } = useSelector((state) => state.devices);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleLock = async () => {
    if (!selectedDevice) {
      toast.error('Pilih perangkat terlebih dahulu');
      return;
    }
    try {
      await dispatch(lockDevice(selectedDevice._id)).unwrap();
      toast.success('Perangkat berhasil dikunci!');
      dispatch(fetchDevices());
    } catch (error) {
      toast.error('Gagal mengunci perangkat');
    }
  };

  const handleUnlock = async () => {
    if (!selectedDevice) {
      toast.error('Pilih perangkat terlebih dahulu');
      return;
    }
    try {
      await dispatch(unlockDevice(selectedDevice._id)).unwrap();
      toast.success('Perangkat berhasil dibuka!');
      dispatch(fetchDevices());
    } catch (error) {
      toast.error('Gagal membuka perangkat');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'online':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Online</span>;
      case 'offline':
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Offline</span>;
      case 'lost':
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Lost Mode</span>;
      case 'maintenance':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Maintenance</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  const onlineDevices = devices.filter(d => d.status === 'online' || d.status === 'maintenance');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Device Lock Pro</h1>
          <p className="text-gray-600">Kelola penguncian perangkat dengan mudah</p>
        </div>
        <button
          onClick={() => dispatch(fetchDevices())}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FiRefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Selection */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Daftar Perangkat</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {devices.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada perangkat terdaftar</p>
            ) : (
              devices.map((device) => (
                <button
                  key={device._id}
                  onClick={() => setSelectedDevice(device)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedDevice?._id === device._id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        device.status === 'online' ? 'bg-green-500' :
                        device.status === 'offline' ? 'bg-gray-400' :
                        device.status === 'lost' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}></div>
                      <span className="text-sm font-medium">{device.name}</span>
                    </div>
                    {getStatusBadge(device.status)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{device.deviceId}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Device Control */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          {selectedDevice ? (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">{selectedDevice.name}</h3>
                <p className="text-sm text-gray-500">ID: {selectedDevice.deviceId}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-gray-600">Status:</span>
                  {getStatusBadge(selectedDevice.status)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-600">
                  <FiAlertCircle className="w-5 h-5" />
                  <p className="text-sm">
                    {selectedDevice.status === 'maintenance' 
                      ? 'Perangkat sedang dalam mode terkunci'
                      : 'Perangkat dalam keadaan normal'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {selectedDevice.status === 'maintenance' ? (
                  <button
                    onClick={handleUnlock}
                    className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                  >
                    <FiUnlock className="w-6 h-6" />
                    Buka Perangkat
                  </button>
                ) : selectedDevice.status === 'online' ? (
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
                      className="w-full px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2 text-lg font-medium"
                    >
                      <FiLock className="w-6 h-6" />
                      Kunci Perangkat
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Perangkat tidak dapat dikunci karena sedang offline</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiLock className="w-16 h-16 mb-4" />
              <p className="text-lg">Pilih perangkat dari daftar</p>
              <p className="text-sm">Untuk mengunci atau membuka perangkat</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
