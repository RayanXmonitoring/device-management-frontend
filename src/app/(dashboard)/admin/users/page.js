'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  suspendUser, 
  activateUser 
} from '@/store/slices/adminSlice';
import { FiPlus, FiEdit2, FiTrash2, FiUserX, FiUserCheck, FiSearch } from 'react-icons/fi';
import Modal from '@/components/common/Modal';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export default function AdminUsersPage() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const onSubmit = async (data) => {
    try {
      if (editingUser) {
        await dispatch(updateUser({ id: editingUser._id, data })).unwrap();
        toast.success('User berhasil diperbarui!');
      } else {
        await dispatch(createUser(data)).unwrap();
        toast.success('User berhasil dibuat!');
      }
      setShowModal(false);
      setEditingUser(null);
      reset();
      dispatch(fetchUsers());
    } catch (error) {
      toast.error(error || 'Gagal menyimpan user');
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User berhasil dihapus!');
      dispatch(fetchUsers());
    } catch (error) {
      toast.error('Gagal menghapus user');
    }
  };

  const handleSuspend = async (userId) => {
    try {
      await dispatch(suspendUser(userId)).unwrap();
      toast.success('User berhasil di-suspend!');
      dispatch(fetchUsers());
    } catch (error) {
      toast.error('Gagal suspend user');
    }
  };

  const handleActivate = async (userId) => {
    try {
      await dispatch(activateUser(userId)).unwrap();
      toast.success('User berhasil diaktifkan!');
      dispatch(fetchUsers());
    } catch (error) {
      toast.error('Gagal aktivasi user');
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-800',
      reseller: 'bg-blue-100 text-blue-800',
      user: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kelola User</h1>
          <p className="text-gray-600">Manajemen akun pengguna sistem</p>
        </div>
        <button
          onClick={() => {
            setEditingUser(null);
            reset();
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FiPlus className="w-5 h-5" />
          Tambah User
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="suspended">Suspend</option>
            <option value="pending">Pending</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Semua Role</option>
            <option value="admin">Administrator</option>
            <option value="reseller">Reseller</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lisensi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className={user._id === currentUser?._id ? 'bg-blue-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                          {user._id === currentUser?._id && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Anda
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{user.license?.type || '-'}</div>
                    <div className="text-xs text-gray-400">
                      {user.license?.expiryDate ? new Date(user.license.expiryDate).toLocaleDateString() : '-'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingUser(user);
                          reset({
                            name: user.name,
                            email: user.email,
                            role: user.role,
                            status: user.status,
                            licenseType: user.license?.type || 'user_30days',
                          });
                          setShowModal(true);
                        }}
                        className="p-1 hover:bg-gray-100 rounded"
                        title="Edit"
                      >
                        <FiEdit2 className="w-5 h-5 text-blue-600" />
                      </button>
                      {user._id !== currentUser?._id && (
                        <>
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleSuspend(user._id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Suspend"
                            >
                              <FiUserX className="w-5 h-5 text-yellow-600" />
                            </button>
                          ) : user.status === 'suspended' ? (
                            <button
                              onClick={() => handleActivate(user._id)}
                              className="p-1 hover:bg-gray-100 rounded"
                              title="Aktifkan"
                            >
                              <FiUserCheck className="w-5 h-5 text-green-600" />
                            </button>
                          ) : null}
                          <button
                            onClick={() => handleDelete(user._id)}
                            className="p-1 hover:bg-gray-100 rounded"
                            title="Hapus"
                          >
                            <FiTrash2 className="w-5 h-5 text-red-600" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingUser(null);
          reset();
        }}
        title={editingUser ? 'Edit User' : 'Tambah User Baru'}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Nama wajib diisi' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan nama lengkap"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              {...register('email', { 
                required: 'Email wajib diisi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email tidak valid'
                }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Masukkan email"
              disabled={!!editingUser}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {!editingUser && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                {...register('password', { 
                  required: 'Password wajib diisi',
                  minLength: {
                    value: 6,
                    message: 'Password minimal 6 karakter'
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register('role')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user">User</option>
              <option value="reseller">Reseller</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register('status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Aktif</option>
              <option value="suspended">Suspend</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipe Lisensi
            </label>
            <select
              {...register('licenseType')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="user_30days">User (30 Hari)</option>
              <option value="user_1year">User (1 Tahun)</option>
              <option value="reseller">Reseller (1 Tahun)</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingUser ? 'Perbarui' : 'Simpan'}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                setEditingUser(null);
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
