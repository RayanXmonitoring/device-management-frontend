'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoles, updateRole } from '@/store/slices/adminSlice';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';

export default function AdminRolesPage() {
  const [editingRole, setEditingRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const dispatch = useDispatch();
  const { roles, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleEditRole = (role) => {
    setEditingRole(role._id);
    setPermissions(role.permissions || {});
  };

  const handleSaveRole = async (roleId) => {
    try {
      await dispatch(updateRole({ id: roleId, data: { permissions } })).unwrap();
      toast.success('Role berhasil diperbarui!');
      setEditingRole(null);
      dispatch(fetchRoles());
    } catch (error) {
      toast.error('Gagal memperbarui role');
    }
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setPermissions({});
  };

  const togglePermission = (category, permission) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [permission]: !prev[category]?.[permission],
      },
    }));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Role</h1>
        <p className="text-gray-600">Kelola hak akses dan izin pengguna</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {roles.map((role) => (
          <div key={role._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {role.displayName}
                  {role.isSystem && (
                    <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">System</span>
                  )}
                </h3>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
              {editingRole === role._id ? (
                <div className="flex gap-2">
                  <button onClick={() => handleSaveRole(role._id)} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    <FiSave className="w-5 h-5" />
                  </button>
                  <button onClick={handleCancelEdit} className="p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button onClick={() => handleEditRole(role)} className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <FiEdit2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="space-y-4">
              {editingRole === role._id ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(permissions).map(([category, perms]) => (
                    <div key={category} className="border rounded-lg p-4">
                      <h4 className="font-medium text-gray-700 mb-2 capitalize">{category.replace('_', ' ')}</h4>
                      <div className="space-y-2">
                        {Object.entries(perms).map(([perm, value]) => (
                          <label key={perm} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={() => togglePermission(category, perm)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            {perm.replace('_', ' ')}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {role.permissions && Object.values(role.permissions).flatMap(
                    (perms) => Object.keys(perms).map((perm) => (
                      <span key={perm} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {perm.replace('_', ' ')}
                      </span>
                    ))
                  )}
                  {(!role.permissions || Object.keys(role.permissions).length === 0) && (
                    <p className="text-sm text-gray-500">Tidak ada izin</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
