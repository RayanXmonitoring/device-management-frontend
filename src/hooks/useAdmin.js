import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  fetchRoles,
  updateRole,
  fetchLicenses,
  createLicense,
  updateLicense,
  fetchSettings,
  updateSettings,
} from '@/store/slices/adminSlice';
import toast from 'react-hot-toast';

export const useAdmin = () => {
  const dispatch = useDispatch();
  const {
    users,
    roles,
    licenses,
    systemSettings,
    isLoading,
    error,
  } = useSelector((state) => state.admin);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedLicense, setSelectedLicense] = useState(null);

  // User Management
  const loadUsers = async () => {
    try {
      await dispatch(fetchUsers()).unwrap();
    } catch (error) {
      toast.error('Gagal memuat data users');
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      toast.success('User berhasil dibuat');
      await loadUsers();
      return true;
    } catch (error) {
      toast.error(error || 'Gagal membuat user');
      return false;
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await dispatch(updateUser({ id: userId, data: userData })).unwrap();
      toast.success('User berhasil diperbarui');
      await loadUsers();
      return true;
    } catch (error) {
      toast.error(error || 'Gagal memperbarui user');
      return false;
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Apakah Anda yakin ingin menghapus user ini?')) return false;
    try {
      await dispatch(deleteUser(userId)).unwrap();
      toast.success('User berhasil dihapus');
      await loadUsers();
      return true;
    } catch (error) {
      toast.error('Gagal menghapus user');
      return false;
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await dispatch(suspendUser(userId)).unwrap();
      toast.success('User berhasil di-suspend');
      await loadUsers();
      return true;
    } catch (error) {
      toast.error('Gagal suspend user');
      return false;
    }
  };

  const handleActivateUser = async (userId) => {
    try {
      await dispatch(activateUser(userId)).unwrap();
      toast.success('User berhasil diaktifkan');
      await loadUsers();
      return true;
    } catch (error) {
      toast.error('Gagal aktivasi user');
      return false;
    }
  };

  // Role Management
  const loadRoles = async () => {
    try {
      await dispatch(fetchRoles()).unwrap();
    } catch (error) {
      toast.error('Gagal memuat data roles');
    }
  };

  const handleUpdateRole = async (roleId, roleData) => {
    try {
      await dispatch(updateRole({ id: roleId, data: roleData })).unwrap();
      toast.success('Role berhasil diperbarui');
      await loadRoles();
      return true;
    } catch (error) {
      toast.error(error || 'Gagal memperbarui role');
      return false;
    }
  };

  // License Management
  const loadLicenses = async () => {
    try {
      await dispatch(fetchLicenses()).unwrap();
    } catch (error) {
      toast.error('Gagal memuat data lisensi');
    }
  };

  const handleCreateLicense = async (licenseData) => {
    try {
      await dispatch(createLicense(licenseData)).unwrap();
      toast.success('Lisensi berhasil dibuat');
      await loadLicenses();
      return true;
    } catch (error) {
      toast.error(error || 'Gagal membuat lisensi');
      return false;
    }
  };

  const handleUpdateLicense = async (licenseId, licenseData) => {
    try {
      await dispatch(updateLicense({ id: licenseId, data: licenseData })).unwrap();
      toast.success('Lisensi berhasil diperbarui');
      await loadLicenses();
      return true;
    } catch (error) {
      toast.error(error || 'Gagal memperbarui lisensi');
      return false;
    }
  };

  // System Settings
  const loadSettings = async () => {
    try {
      await dispatch(fetchSettings()).unwrap();
    } catch (error) {
      toast.error('Gagal memuat pengaturan sistem');
    }
  };

  const handleUpdateSettings = async (settingsData) => {
    try {
      await dispatch(updateSettings(settingsData)).unwrap();
      toast.success('Pengaturan berhasil diperbarui');
      await loadSettings();
      return true;
    } catch (error) {
      toast.error(error || 'Gagal memperbarui pengaturan');
      return false;
    }
  };

  // Initial load
  useEffect(() => {
    loadUsers();
    loadRoles();
    loadLicenses();
    loadSettings();
  }, []);

  return {
    // Data
    users,
    roles,
    licenses,
    systemSettings,
    isLoading,
    error,
    selectedUser,
    selectedRole,
    selectedLicense,
    
    // Setters
    setSelectedUser,
    setSelectedRole,
    setSelectedLicense,
    
    // User actions
    loadUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    handleSuspendUser,
    handleActivateUser,
    
    // Role actions
    loadRoles,
    handleUpdateRole,
    
    // License actions
    loadLicenses,
    handleCreateLicense,
    handleUpdateLicense,
    
    // Settings actions
    loadSettings,
    handleUpdateSettings,
  };
};
