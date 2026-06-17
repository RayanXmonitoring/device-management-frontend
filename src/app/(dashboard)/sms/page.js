'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices } from '@/store/slices/deviceSlice';
import { fetchSmsHistory, deleteSms, exportSms } from '@/store/slices/monitoringSlice';
import { FiMessageSquare, FiSearch, FiDownload, FiTrash2, FiRefreshCw, FiFilter } from 'react-icons/fi';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';

export default function SmsPage() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMessages, setSelectedMessages] = useState([]);
  const dispatch = useDispatch();
  const { devices, isLoading: devicesLoading } = useSelector((state) => state.devices);
  const { smsHistory, isLoading: smsLoading } = useSelector((state) => state.monitoring);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDevice) {
      dispatch(fetchSmsHistory(selectedDevice._id));
    }
  }, [dispatch, selectedDevice]);

  const filteredMessages = smsHistory.filter(msg => {
    const matchesSearch = msg.sender.includes(searchTerm) || 
                         msg.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || msg.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleDelete = async (smsId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus SMS ini?')) return;
    try {
      await dispatch(deleteSms(smsId)).unwrap();
      toast.success('SMS berhasil dihapus');
      dispatch(fetchSmsHistory(selectedDevice._id));
    } catch (error) {
      toast.error('Gagal menghapus SMS');
    }
  };

  const handleExport = async () => {
    try {
      await dispatch(exportSms(selectedDevice._id)).unwrap();
      toast.success('SMS berhasil diekspor');
    } catch (error) {
      toast.error('Gagal mengekspor SMS');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'incoming':
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Masuk</span>;
      case 'outgoing':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Keluar</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Unknown</span>;
    }
  };

  if (devicesLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat SMS</h1>
          <p className="text-gray-600">Pantau riwayat SMS perangkat</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => dispatch(fetchSmsHistory(selectedDevice?._id))}
            className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FiRefreshCw className="w-5 h-5 text-gray-600" />
          </button>
          {selectedDevice && smsHistory.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
            >
              <FiDownload className="w-4 h-4" />
              Ekspor
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Device Selection */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow p-4">
          <h3 className="font-semibold text-gray-800 mb-3">Pilih Perangkat</h3>
          <div className="space-y-2">
            {devices.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada perangkat</p>
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
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      device.status === 'online' ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <span className="text-sm font-medium">{device.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{device.deviceId}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* SMS List */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
          {selectedDevice ? (
            <>
              {/* Filters */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex-1 relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari SMS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua</option>
                  <option value="incoming">Masuk</option>
                  <option value="outgoing">Keluar</option>
                </select>
              </div>

              {/* SMS List */}
              {smsLoading ? (
                <Loading />
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FiMessageSquare className="w-16 h-16 mx-auto mb-4" />
                  <p>Tidak ada riwayat SMS</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {filteredMessages.map((sms) => (
                    <div
                      key={sms._id}
                      className={`p-4 rounded-lg border ${
                        sms.type === 'incoming' ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-gray-800">{sms.sender}</span>
                            {getTypeBadge(sms.type)}
                          </div>
                          <p className="text-gray-700">{sms.content}</p>
                          <p className="text-xs text-gray-500 mt-1">{formatDate(sms.timestamp)}</p>
                        </div>
                        <button
                          onClick={() => handleDelete(sms._id)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          title="Hapus"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Stats */}
              {smsHistory.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-500">Total:</span>
                    <span className="ml-1 font-medium">{smsHistory.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Masuk:</span>
                    <span className="ml-1 font-medium text-green-600">
                      {smsHistory.filter(m => m.type === 'incoming').length}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Keluar:</span>
                    <span className="ml-1 font-medium text-blue-600">
                      {smsHistory.filter(m => m.type === 'outgoing').length}
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiMessageSquare className="w-16 h-16 mb-4" />
              <p className="text-lg">Pilih perangkat untuk melihat riwayat SMS</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
