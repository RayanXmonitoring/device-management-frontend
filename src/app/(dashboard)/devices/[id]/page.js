'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDeviceById, updateDevice, lockDevice, unlockDevice, setLostMode } from '@/store/slices/deviceSlice';
import { FiArrowLeft, FiEdit2, FiLock, FiUnlock, FiAlertTriangle, FiRefreshCw } from 'react-icons/fi';
import DeviceControls from '@/components/devices/DeviceControls';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';

export default function DeviceDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedDevice, isLoading } = useSelector((state) => state.devices);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    if (id) {
      dispatch(fetchDeviceById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedDevice) {
      setEditData({
        name: selectedDevice.name || '',
        model: selectedDevice.model || '',
        manufacturer: selectedDevice.manufacturer || '',
        osVersion: selectedDevice.osVersion || '',
        appVersion: selectedDevice.appVersion || '',
      });
    }
  }, [selectedDevice]);

  const handleUpdate = async () => {
    try {
      await dispatch(updateDevice({ id, data: editData })).unwrap();
      toast.success('Perangkat berhasil diperbarui!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Gagal memperbarui perangkat');
    }
  };

  const handleLock = async () => {
    try {
      await dispatch(lockDevice(id)).unwrap();
      toast.success('Perangkat berhasil dikunci!');
    } catch (error) {
      toast.error('Gagal mengunci perangkat');
    }
  };

  const handleUnlock = async () => {
    try {
      await dispatch(unlockDevice(id)).unwrap();
      toast.success('Perangkat berhasil dibuka!');
    } catch (error) {
      toast.error('Gagal membuka perangkat');
    }
  };

  const handleLostMode = async () => {
    try {
      await dispatch(setLostMode(id)).unwrap();
      toast.success('Lost mode berhasil diaktifkan!');
    } catch (error) {
      toast.error('Gagal mengaktifkan lost mode');
    }
  };

  if (isLoading || !selectedDevice) {
    return <Loading />;
  }

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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FiArrowLeft className="w-5 h-5" />
        Kembali
      </button>

      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(selectedDevice.status)}`}></div>
              <span className="font-medium">{getStatusText(selectedDevice.status)}</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{selectedDevice.name}</h1>
            <span className="text-sm text-gray-500">({selectedDevice.deviceId})</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <FiEdit2 className="w-4 h-4" />
              {isEditing ? 'Batal' : 'Edit'}
            </button>
            <button
              onClick={handleLock}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center gap-2"
            >
              <FiLock className="w-4 h-4" />
              Kunci
            </button>
            <button
              onClick={handleUnlock}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FiUnlock className="w-4 h-4" />
              Buka
            </button>
            <button
              onClick={handleLostMode}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
            >
              <FiAlertTriangle className="w-4 h-4" />
              Lost Mode
            </button>
            <button
              onClick={() => dispatch(fetchDeviceById(id))}
              className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              title="Refresh"
            >
              <FiRefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Device Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Basic Info */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informasi Perangkat</h2>
          
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                <input
                  type="text"
                  value={editData.model}
                  onChange={(e) => setEditData({ ...editData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                <input
                  type="text"
                  value={editData.manufacturer}
                  onChange={(e) => setEditData({ ...editData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OS Version</label>
                <input
                  type="text"
                  value={editData.osVersion}
                  onChange={(e) => setEditData({ ...editData, osVersion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">App Version</label>
                <input
                  type="text"
                  value={editData.appVersion}
                  onChange={(e) => setEditData({ ...editData, appVersion: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleUpdate}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan Perubahan
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Device ID</p>
                <p className="font-medium">{selectedDevice.deviceId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipe</p>
                <p className="font-medium capitalize">{selectedDevice.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{selectedDevice.model || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Manufacturer</p>
                <p className="font-medium">{selectedDevice.manufacturer || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">OS Version</p>
                <p className="font-medium">{selectedDevice.osVersion || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">App Version</p>
                <p className="font-medium">{selectedDevice.appVersion || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Terakhir Aktif</p>
                <p className="font-medium">
                  {selectedDevice.lastSeen ? new Date(selectedDevice.lastSeen).toLocaleString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Terdaftar</p>
                <p className="font-medium">
                  {selectedDevice.enrollmentDate ? new Date(selectedDevice.enrollmentDate).toLocaleString() : '-'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Device Controls */}
        <div className="bg-white rounded-lg shadow p-6">
          <DeviceControls device={selectedDevice} />
        </div>
      </div>

      {/* Lost Mode Info */}
      {selectedDevice.lostMode?.active && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold flex items-center gap-2">
            <FiAlertTriangle className="w-5 h-5" />
            Lost Mode Aktif
          </h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-red-700">
              <span className="font-medium">Pesan:</span> {selectedDevice.lostMode.message || '-'}
            </p>
            <p className="text-sm text-red-700">
              <span className="font-medium">Kontak:</span> {selectedDevice.lostMode.contactInfo || '-'}
            </p>
            <p className="text-sm text-red-700">
              <span className="font-medium">Diaktifkan:</span>{' '}
              {selectedDevice.lostMode.activatedAt ? new Date(selectedDevice.lostMode.activatedAt).toLocaleString() : '-'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
