'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLicenses, createLicense, updateLicense } from '@/store/slices/adminSlice';
import { fetchUsers } from '@/store/slices/adminSlice';
import { FiPlus, FiRefreshCw, FiEdit2, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

// Simple Modal Component
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

// Loading Component
const Loading = () => (
  <div className="flex items-center justify-center p-8">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
  </div>
);

export default function AdminLicensesPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingLicense, setEditingLicense] = useState(null);
  const dispatch = useDispatch();
  const { licenses, users, isLoading } = useSelector((state) => state.admin);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchLicenses());
    dispatch(fetchUsers());
  }, [dispatch]);

  const onSubmit = async (data) => {
    try {
      if (editingLicense) {
        await dispatch(updateLicense({ id: editingLicense._id, data })).unwrap();
        toast.success('Lisensi berhasil diperbarui!');
      } else {
        await dispatch(createLicense(data)).unwrap();
        toast.success('Lisensi berhasil dibuat!');
      }
      setShowModal(false);
      setEditingLicense(null);
      reset();
      dispatch(fetchLicenses());
    } catch (error) {
      toast.error(error || 'Gagal menyimpan lisensi');
    }
  };

  const getStatusBadge = (license) => {
    const isExpired = new Date(license.expiryDate) < new Date();
    if (!license.isActive) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">Nonaktif</span>;
    }
    if (isExpired) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">Kadaluarsa</span>;
    }
    const daysRemaining = Math.ceil((new Date(license.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (daysRemaining <= 30) {
      return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">Akan Kadaluarsa</span>;
    }
    return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Aktif</span>;
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Lisensi</h1>
          <p className="text-gray-600">Kelola lisensi pengguna</p>
        </div>
        <button
          onClick={() => {
            setEditingLicense(null);
            reset();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Tambah Lisensi
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kadaluarsa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hari Tersisa
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {licenses.map((license) => (
                <tr key={license._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {license.userId?.name || 'Unknown'}
                    </div>
                    <div className="text-sm text-gray-500">{license.userId?.email || '-'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {license.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(license)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(license.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {license.isActive && new Date(license.expiryDate) > new Date() ? (
                      <span className="font-medium text-green-600">
                        {Math.ceil((new Date(license.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} hari
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingLicense(null);
          reset();
        }}
        title={editingLicense ? 'Edit Lisensi' : 'Tambah Lisensi Baru'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User *
            </label>
            <select
              {...register('userId', { required: 'User wajib dipilih' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Pilih User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            {errors.userId && (
              <p className="mt-1 text-sm text-red-600">{errors.userId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Lisensi *
            </label>
            <select
              {...register('type', { required: 'Tipe lisensi wajib dipilih' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user_30days">User (30 Hari)</option>
              <option value="user_1year">User (1 Tahun)</option>
              <option value="reseller">Reseller (1 Tahun)</option>
            </select>
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Durasi (Hari) *
            </label>
            <input
              type="number"
              {...register('durationDays', { 
                required: 'Durasi wajib diisi',
                min: {
                  value: 1,
                  message: 'Durasi minimal 1 hari'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan durasi dalam hari"
            />
            {errors.durationDays && (
              <p className="mt-1 text-sm text-red-600">{errors.durationDays.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingLicense ? 'Perbarui' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingLicense(null);
                reset();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
