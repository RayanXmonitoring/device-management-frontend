'use client';

import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices } from '@/store/slices/deviceSlice';
import { startScreenStream, stopScreenStream, captureScreen } from '@/store/slices/monitoringSlice';
import { FiMonitor, FiVideo, FiVideoOff, FiCamera, FiRefreshCw, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function LiveScreenPage() {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const screenRef = useRef(null);
  const dispatch = useDispatch();
  const { devices, isLoading } = useSelector((state) => state.devices);
  const { screenStream, isStreaming: isStreamingState } = useSelector((state) => state.monitoring);

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  const handleStartStream = async () => {
    if (!selectedDevice) {
      toast.error('Pilih perangkat terlebih dahulu');
      return;
    }
    try {
      await dispatch(startScreenStream(selectedDevice._id)).unwrap();
      setIsStreaming(true);
      toast.success('Streaming layar dimulai');
    } catch (error) {
      toast.error('Gagal memulai streaming layar');
    }
  };

  const handleStopStream = async () => {
    try {
      await dispatch(stopScreenStream()).unwrap();
      setIsStreaming(false);
      toast.success('Streaming layar dihentikan');
    } catch (error) {
      toast.error('Gagal menghentikan streaming');
    }
  };

  const handleCapture = () => {
    if (!screenRef.current) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = screenRef.current.clientWidth;
    canvas.height = screenRef.current.clientHeight;
    context.drawImage(screenRef.current, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg');
    setCapturedImages(prev => [imageData, ...prev]);
    toast.success('Screenshot berhasil diambil');
  };

  const handleDownload = (imageData, index) => {
    const link = document.createElement('a');
    link.download = `screenshot-${Date.now()}-${index}.jpg`;
    link.href = imageData;
    link.click();
  };

  const onlineDevices = devices.filter(d => d.status === 'online');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Live Screen Monitoring</h1>
          <p className="text-gray-600">Pantau layar perangkat secara real-time</p>
        </div>
        <button
          onClick={() => dispatch(fetchDevices())}
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
            {onlineDevices.length === 0 ? (
              <p className="text-sm text-gray-500">Tidak ada perangkat online</p>
            ) : (
              onlineDevices.map((device) => (
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
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium">{device.name}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{device.deviceId}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Screen Feed */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow p-4">
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden relative">
            {isStreaming ? (
              <>
                <div
                  ref={screenRef}
                  className="w-full h-full flex items-center justify-center"
                >
                  <img
                    src={screenStream || '/images/screen-placeholder.png'}
                    alt="Screen Feed"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full animate-pulse">
                    ● LIVE
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <FiMonitor className="w-16 h-16 mb-4" />
                <p className="text-sm">
                  {selectedDevice ? 'Klik "Mulai Streaming" untuk melihat layar' : 'Pilih perangkat terlebih dahulu'}
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedDevice && (
              <>
                {!isStreaming ? (
                  <button
                    onClick={handleStartStream}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                  >
                    <FiVideo className="w-4 h-4" />
                    Mulai Streaming
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleStopStream}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                    >
                      <FiVideoOff className="w-4 h-4" />
                      Stop Streaming
                    </button>
                    <button
                      onClick={handleCapture}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                      <FiCamera className="w-4 h-4" />
                      Screenshot
                    </button>
                  </>
                )}
              </>
            )}
          </div>

          {/* Captured Images */}
          {capturedImages.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium text-gray-700 mb-3">Hasil Screenshot ({capturedImages.length})</h4>
              <div className="grid grid-cols-3 gap-3">
                {capturedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      onClick={() => handleDownload(image, index)}
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"
                    >
                      <FiDownload className="w-6 h-6 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
