import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMoreVertical, FiEye, FiLock, FiUnlock, FiAlertTriangle } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { lockDevice, setLostMode } from '@/store/slices/deviceSlice';
import toast from 'react-hot-toast';

export default function DeviceList({ devices }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();
  const dispatch = useDispatch();

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-gray-400';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'online': return 'Online';
      case 'offline': return 'Offline';
      case 'lost': return 'Lost Mode';
      default: return 'Unknown';
    }
  };

  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          device.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLockDevice = async (deviceId) => {
    try {
      await dispatch(lockDevice(deviceId)).unwrap();
      toast.success('Perangkat berhasil dikunci');
    } catch (error) {
      toast.error('Gagal mengunci perangkat');
    }
  };

  const handleLostMode = async (deviceId) => {
    try {
      await dispatch(setLostMode(deviceId)).unwrap();
      toast.success('Lost Mode diaktifkan');
    } catch (error) {
      toast.error('Gagal mengaktifkan Lost Mode');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Perangkat Terhubung</h2>
          <div className="flex flex-wrap gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari perangkat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <FiEye className="absolute left-3 top-3 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="lost">Lost Mode</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Perangkat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Perangkat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Terakhir Aktif
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDevices.map((device) => (
              <tr key={device.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)} mr-3`}></div>
                    <div className="text-sm font-medium text-gray-900">{device.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {device.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${device.status === 'online' ? 'bg-green-100 text-green-800' : device.status === 'lost' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {getStatusText(device.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {device.lastActive ? new Date(device.lastActive).toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/devices/${device.id}`)}
                      className="p-1 hover:bg-gray-100 rounded"
                      title="Detail"
                    >
                      <FiEye className="w-5 h-5" />
                    </button>
                    {device.status !== 'lost' && (
                      <>
                        <button
                          onClick={() => handleLockDevice(device.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                          title="Kunci"
                        >
                          <FiLock className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleLostMode(device.id)}
                          className="p-1 hover:bg-gray-100 rounded text-red-500"
                          title="Lost Mode"
                        >
                          <FiAlertTriangle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <FiMoreVertical className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
