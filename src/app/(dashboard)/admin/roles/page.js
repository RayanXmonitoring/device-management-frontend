'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminRolesPage() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const res = await api.get('/admin/roles');
      setRoles(res.data.data || []);
      dispatch({ type: 'admin/fetchRoles/fulfilled', payload: res.data.data });
    } catch (error) {
      toast.error('Gagal memuat roles');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role._id);
    setPermissions(role.permissions || {});
  };

  const handleSave = async (roleId) => {
    try {
      await api.put(`/admin/roles/${roleId}`, { permissions });
      toast.success('Role berhasil diperbarui!');
      setEditingRole(null);
      fetchRoles();
    } catch (error) {
      toast.error('Gagal memperbarui role');
    }
  };

  const togglePermission = (category, permission) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category]?.[permission],
      },
    }));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manajemen Role</h1>

      <div className="space-y-6">
        {roles.map((role) => (
          <div key={role._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {role.displayName}
                  {role.isSystem && (
                    <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded">System</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
              {editingRole === role._id ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSave(role._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Simpan
                  </button>
                  <button
                    onClick={() => setEditingRole(null)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(role)}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Edit
                </button>
              )}
            </div>

            {editingRole === role._id ? (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(permissions).map(([category, perms]) => (
                  <div key={category} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 capitalize">{category.replace('_', ' ')}</h4>
                    {Object.entries(perms).map(([perm, value]) => (
                      <label key={perm} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={() => togglePermission(category, perm)}
                        />
                        {perm.replace('_', ' ')}
                      </label>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {role.permissions &&
                  Object.values(role.permissions).flatMap((perms) =>
                    Object.keys(perms).map((perm) => (
                      <span key={perm} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {perm.replace('_', ' ')}
                      </span>
                    ))
                  )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
