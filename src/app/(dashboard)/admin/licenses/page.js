'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import api from '@/lib/api';
import Modal from '@/components/common/Modal';
import toast from 'react-hot-toast';

export default function AdminLicensesPage() {
  const [licenses, setLicenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ userId: '', type: 'user_30days', durationDays: 30 });
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [licensesRes, usersRes] = await Promise.all([
        api.get('/admin/licenses'),
        api.get('/admin/users'),
      ]);
      setLicenses(licensesRes.data.data || []);
      setUsers(usersRes.data.data || []);
      dispatch({ type: 'admin/fetchLicenses/fulfilled', payload: licensesRes.data.data });
      dispatch({ type: 'admin/fetchUsers/fulfilled', payload: usersRes.data.data });
    } catch (error) {
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/licenses', formData);
      toast.success('Lisensi berhasil dibuat!');
      setShowModal(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat lisensi');
    }
  };

  const getStatusBadge = (license) => {
    const isExpired = new Date(license.expiryDate) < new Date();
    if (!license.isActive) {
      return <span className="px-2 py-1 text-xs rounded-full bg-gray-200">Nonaktif</span>;
    }
    if (isExpired) {
      return <span className="px-2 py-1 text-xs rounded-full bg-red-200 text-red-800">Kadaluarsa</span>;
    }
    const days = Math.ceil((new Date(license.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    if (days <= 30) {
      return <span className="px-2 py-1 text-xs rounded-full bg-yellow-200 text-yellow-800">Akan Kadaluarsa</span>;
    }
    return <span className="px-2 py-1 text-xs rounded-full bg-green-200 text-green-800">Aktif</span>;
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manajemen Lisensi</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Tambah Lisensi
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipe</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kadaluarsa</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {licenses.map((license) => (
              <tr key={license._id}>
                <td className="px-6 py-4">
                  <div className="font-medium">{license.userId?.name || 'Unknown'}</div>
                  <div className="text-sm text-gray-500">{license.userId?.email || '-'}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100">{license.type}</span>
                </td>
                <td className="px-6 py-4">{getStatusBadge(license)}</td>
                <td className="px-6 py-4 text-sm">{new Date(license.expiryDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Tambah Lisensi">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">User</label>
            <select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Pilih User</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tipe Lisensi</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="user_30days">User (30 Hari)</option>
              <option value="user_1year">User (1 Tahun)</option>
              <option value="reseller">Reseller (1 Tahun)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durasi (Hari)</label>
            <input
              type="number"
              value={formData.durationDays}
              onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
              min="1"
              required
            />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
              Simpan
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
            >
              Batal
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
