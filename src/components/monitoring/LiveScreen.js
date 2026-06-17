'use client';

import { useState, useEffect, useRef } from 'react';
import { FiMonitor, FiVideo, FiVideoOff, FiCamera, FiDownload } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { startScreenStream, stopScreenStream, captureScreen } from '@/store/slices/monitoringSlice';
import toast from 'react-hot-toast';

const LiveScreen = ({ deviceId, deviceName }) => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [capturedImages, setCapturedImages] = useState([]);
  const screenRef = useRef(null);
  const dispatch = useDispatch();
  const { screenStream, isStreaming: isStreamingState } = useSelector((state) => state.monitoring);

  useEffect(() => {
    if (screenStream) {
      setIsStreaming(true);
    }
  }, [screenStream]);

  const handleStartStream = async () => {
    if (!deviceId) {
      toast.error('Pilih perangkat terlebih dahulu');
      return;
    }
    try {
      await dispatch(startScreenStream(deviceId)).unwrap();
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

  return (
    <div className="space-y-4">
      {/* Screen Feed */}
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
              <span className="px-2 py-1 bg-gray-800 text-white text-xs rounded-full">
                {deviceName || 'Device'}
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <FiMonitor className="w-16 h-16 mb-4" />
            <p className="text-sm">
              {deviceId ? 'Klik "Mulai Streaming" untuk melihat layar' : 'Pilih perangkat terlebih dahulu'}
            </p>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-2">
        {deviceId && (
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
        <div>
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
  );
};

export default LiveScreen;
