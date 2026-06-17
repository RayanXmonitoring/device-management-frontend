'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings } from '@/store/slices/adminSlice';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import Loading from '@/components/common/Loading';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();
  const { systemSettings, isLoading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (systemSettings) {
      setSettings(systemSettings);
    }
  }, [systemSettings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await dispatch(updateSettings(settings)).unwrap();
      toast.success('Pengaturan berhasil diperbarui!');
    } catch (error) {
      toast.error('Gagal memperbarui pengaturan');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
          <p className="text-gray-600">Kelola konfigurasi sistem</p>
        </div>
        <button
          onClick={() => dispatch(fetchSettings())}
          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          title="Refresh"
        >
          <FiRefreshCw className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Umum</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Situs
              </label>
              <input
                type="text"
                value={settings.siteName || ''}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Situs
              </label>
              <input
                type="text"
                value={settings.siteDescription || ''}
                onChange={(e) => handleChange('siteDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Keamanan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maksimal Percobaan Login
              </label>
              <input
                type="number"
                value={settings.maxLoginAttempts || 5}
                onChange={(e) => handleChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi Lockout (Menit)
              </label>
              <input
                type="number"
                value={settings.lockoutDuration || 15}
                onChange={(e) => handleChange('lockoutDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Device Settings */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pengaturan Perangkat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maksimal Perangkat per User
              </label>
              <input
                type="number"
                value={settings.maxDevicesPerUser || 5}
                onChange={(e) => handleChange('maxDevicesPerUser', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timeout Sesi (Detik)
              </label>
              <input
                type="number"
                value={settings.sessionTimeout || 3600}
                onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="60"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Fitur</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.registrationEnabled !== false}
                onChange={(e) => handleChange('registrationEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Registrasi
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.backupEnabled !== false}
                onChange={(e) => handleChange('backupEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Backup
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.encryptionEnabled !== false}
                onChange={(e) => handleChange('encryptionEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Enkripsi
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.auditLogEnabled !== false}
                onChange={(e) => handleChange('auditLogEnabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Audit Log
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.emailNotifications !== false}
                onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Email Notifikasi
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.pushNotifications !== false}
                onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Push Notifikasi
            </label>
          </div>
        </div>

        {/* Maintenance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Maintenance</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={settings.maintenance || false}
                onChange={(e) => handleChange('maintenance', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              Mode Maintenance
            </label>
            {settings.maintenance && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pesan Maintenance
                </label>
                <textarea
                  value={settings.maintenanceMessage || ''}
                  onChange={(e) => handleChange('maintenanceMessage', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Masukkan pesan maintenance"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave className="w-5 h-5" />
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>
    </div>
  );
}
