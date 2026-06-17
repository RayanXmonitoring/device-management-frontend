'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateDevice } from '@/store/slices/deviceSlice';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

const DeviceDetail = ({ device }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: device.name,
    model: device.model || '',
    manufacturer: device.manufacturer || '',
    osVersion: device.osVersion || '',
    appVersion: device.appVersion || '',
  });
  const dispatch = useDispatch();

  const handleSave = async () => {
    try {
      await dispatch(updateDevice({ id: device._id, data: editData })).unwrap();
      toast.success('Perangkat berhasil diperbarui');
      setIsEditing(false);
    } catch (error) {
      toast.error('Gagal memperbarui perangkat');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status) => {
    const colors = {
      online: 'bg-green-100 text-green-800',
      offline: 'bg-gray-100 text-gray-800',
      lost: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Informasi Perangkat</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {isEditing ? <FiX className="w-5 h-5" /> : <FiEdit2 className="w-5 h-5" />}
        </button>
      </div>

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
          <button
            onClick={handleSave}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <FiSave className="w-4 h-4" />
            Simpan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Device ID</p>
            <p className="font-medium">{device.deviceId}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(device.status)}`}>
              {device.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tipe</p>
            <p className="font-medium capitalize">{device.type}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Model</p>
            <p className="font-medium">{device.model || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Manufacturer</p>
            <p className="font-medium">{device.manufacturer || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">OS Version</p>
            <p className="font-medium">{device.osVersion || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">App Version</p>
            <p className="font-medium">{device.appVersion || '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Terakhir Aktif</p>
            <p className="font-medium">{formatDate(device.lastSeen)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Terdaftar</p>
            <p className="font-medium">{formatDate(device.enrollmentDate)}</p>
          </div>
          {device.battery && (
            <div>
              <p className="text-sm text-gray-500">Baterai</p>
              <p className="font-medium">
                {device.battery.level}% {device.battery.isCharging && '⚡'}
              </p>
            </div>
          )}
          {device.location && (
            <div>
              <p className="text-sm text-gray-500">Lokasi</p>
              <p className="font-medium text-sm">
                {device.location.address || `${device.location.coordinates[0]}, ${device.location.coordinates[1]}`}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DeviceDetail;
