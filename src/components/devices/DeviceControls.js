'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { lockDevice, unlockDevice, setLostMode, resetDevice } from '@/store/slices/deviceSlice';
import { FiLock, FiUnlock, FiAlertTriangle, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import Modal from '@/components/common/Modal';

const DeviceControls = ({ device }) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showLostModeModal, setShowLostModeModal] = useState(false);
  const [lostModeMessage, setLostModeMessage] = useState('');
  const [lostModeContact, setLostModeContact] = useState('');
  const dispatch = useDispatch();

  const handleLock = async () => {
    try {
      await dispatch(lockDevice(device._id)).unwrap();
      toast.success('Perangkat berhasil dikunci');
    } catch (error) {
      toast.error('Gagal mengunci perangkat');
    }
  };

  const handleUnlock = async () => {
    try {
      await dispatch(unlockDevice(device._id)).unwrap();
      toast.success('Perangkat berhasil dibuka');
    } catch (error) {
      toast.error('Gagal membuka perangkat');
    }
  };

  const handleLostMode = async () => {
    try {
      await dispatch(setLostMode({ 
        deviceId: device._id, 
        message: lostModeMessage,
        contactInfo: lostModeContact 
      })).unwrap();
      toast.success('Lost mode berhasil diaktifkan');
      setShowLostModeModal(false);
      setLostModeMessage('');
      setLostModeContact('');
    } catch (error) {
      toast.error('Gagal mengaktifkan lost mode');
    }
  };

  const handleReset = async () => {
    try {
      await dispatch(resetDevice(device._id)).unwrap();
      toast.success('Data perangkat berhasil direset');
      setShowResetModal(false);
    } catch (error) {
      toast.error('Gagal mereset perangkat');
    }
  };

  const isLockable = device.status === 'online';
  const isUnlockable = device.status === 'maintenance' || device.status === 'lost';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Kontrol Perangkat</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {isLockable && (
          <button
            onClick={handleLock}
            className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center gap-2"
          >
            <FiLock className="w-5 h-5" />
            Kunci
          </button>
        )}

        {isUnlockable && (
          <button
            onClick={handleUnlock}
            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
          >
            <FiUnlock className="w-5 h-5" />
            Buka
          </button>
        )}

        {device.status !== 'lost' && (
          <button
            onClick={() => setShowLostModeModal(true)}
            className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <FiAlertTriangle className="w-5 h-5" />
            Lost Mode
          </button>
        )}

        <button
          onClick={() => setShowResetModal(true)}
          className="px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
        >
          <FiRefreshCw className="w-5 h-5" />
          Reset
        </button>
      </div>

      {/* Lost Mode Modal */}
      <Modal
        isOpen={showLostModeModal}
        onClose={() => setShowLostModeModal(false)}
        title="Aktifkan Lost Mode"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pesan (Opsional)
            </label>
            <textarea
              value={lostModeMessage}
              onChange={(e) => setLostModeMessage(e.target.value)}
              placeholder="Masukkan pesan yang akan ditampilkan"
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kontak (Opsional)
            </label>
            <input
              type="text"
              value={lostModeContact}
              onChange={(e) => setLostModeContact(e.target.value)}
              placeholder="Masukkan nomor kontak"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleLostMode}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Aktifkan
            </button>
            <button
              onClick={() => setShowLostModeModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>

      {/* Reset Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Data Perangkat"
      >
        <div className="space-y-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-700">
              <strong>Peringatan!</strong> Reset data akan menghapus semua data perangkat 
              dan tidak dapat dibatalkan. Apakah Anda yakin?
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowResetModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Batal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeviceControls;
