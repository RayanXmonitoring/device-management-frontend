'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDevices } from '@/store/slices/deviceSlice';
import DeviceStats from '@/components/dashboard/DeviceStats';
import DeviceList from '@/components/dashboard/DeviceList';
import StatusChart from '@/components/dashboard/StatusChart';
import { useWebSocket } from '@/hooks/useWebSocket';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { devices, stats, isLoading } = useSelector((state) => state.devices);
  const { user } = useSelector((state) => state.auth);
  
  // Connect to WebSocket for real-time updates
  const { isConnected, sendMessage } = useWebSocket('/dashboard');

  useEffect(() => {
    dispatch(fetchDevices());
  }, [dispatch]);

  useEffect(() => {
    if (isConnected) {
      sendMessage({ type: 'subscribe', channel: 'device-updates' });
    }
  }, [isConnected, sendMessage]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Selamat datang, {user?.name || 'User'}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isConnected ? 'Terhubung' : 'Terputus'}
          </span>
        </div>
      </div>

      <DeviceStats stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DeviceList devices={devices} />
        </div>
        <div className="lg:col-span-1">
          <StatusChart devices={devices} />
        </div>
      </div>
    </div>
  );
            }
