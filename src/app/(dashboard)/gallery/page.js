'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices } from '@/store/slices/deviceSlice';
import { fetchGallery, downloadFile, deleteFile } from '@/store/slices/monitoringSlice';
import { FiImage, FiVideo, FiDownload, FiTrash2, FiRefreshCw, FiGrid, FiList } from 'react-icons/fi';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function GalleryPage() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterType, setFilterType] = useState('all');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const dispatch = useDispatch();
  const { devices, isLoading: devicesLoading } = useSelector((state) => state.devices);
  const { gallery, isLoading: galleryLoading } = useSelector((state) => state.monitoring);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (selectedDevice) {
      dispatch(fetchGallery(selectedDevice._id));
    }
  }, [dispatch, selectedDevice]);

  const filteredFiles = gallery.filter(file => {
    if (filterType === 'all') return true;
    return file.type === filterType;
  });

  const handleDownload = async (fileId) => {
    try {
      await dispatch(downloadFile(fileId)).unwrap();
      toast.success('File berhasil diunduh');
    } catch (error) {
      toast.error('Gagal mengunduh file');
    }
  };

  const handleDelete = async (fileId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus file ini?')) return;
    try {
      await dispatch(deleteFile(fileId)).unwrap();
      toast.success('File berhasil dihapus');
      dispatch(fetchGallery(selectedDevice._id));
    } catch (error) {
      toast.error('Gagal menghapus file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
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

  if (devicesLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Device Gallery</h1>
          <p className="text-gray-600">Kelola file media perangkat</p>
        </div>
        <button
          onClick={() => dispatch(fetchGallery(selectedDevice?._id))}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <FiRefreshCw className="w-5 h-5 text-gray-600" />
        </button>
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

        {/* Gallery Content */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
          {selectedDevice ? (
            <>
              {/* Toolbar */}
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                    title="Grid View"
                  >
                    <FiGrid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                    }`}
                    title="List View"
                  >
                    <FiList className="w-5 h-5" />
                  </button>
                </div>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Semua File</option>
                  <option value="image">Gambar</option>
                  <option value="video">Video</option>
                </select>

                <span className="text-sm text-gray-500 ml-auto">
                  {filteredFiles.length} file
                </span>
              </div>

              {/* Gallery Grid */}
              {galleryLoading ? (
                <Loading />
              ) : filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <FiImage className="w-16 h-16 mx-auto mb-4" />
                  <p>Tidak ada file media</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredFiles.map((file) => (
                    <div key={file._id} className="group relative">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {file.type === 'image' ? (
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <FiVideo className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleDownload(file._id)}
                          className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                          title="Download"
                        >
                          <FiDownload className="w-5 h-5 text-gray-700" />
                        </button>
                        <button
                          onClick={() => handleDelete(file._id)}
                          className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5 text-red-600" />
                        </button>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ukuran</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredFiles.map((file) => (
                        <tr key={file._id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              {file.type === 'image' ? (
                                <FiImage className="w-4 h-4 text-blue-500" />
                              ) : (
                                <FiVideo className="w-4 h-4 text-purple-500" />
                              )}
                              <span className="text-sm">{file.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2 text-sm capitalize">{file.type}</td>
                          <td className="px-4 py-2 text-sm">{formatFileSize(file.size)}</td>
                          <td className="px-4 py-2 text-sm">{formatDate(file.createdAt)}</td>
                          <td className="px-4 py-2">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDownload(file._id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FiDownload className="w-4 h-4 text-blue-600" />
                              </button>
                              <button
                                onClick={() => handleDelete(file._id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                <FiTrash2 className="w-4 h-4 text-red-600" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FiImage className="w-16 h-16 mb-4" />
              <p className="text-lg">Pilih perangkat untuk melihat gallery</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
