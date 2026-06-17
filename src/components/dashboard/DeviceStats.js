'use client';

import { FiMonitor, FiWifi, FiWifiOff, FiAlertTriangle, FiTool } from 'react-icons/fi';

const DeviceStats = ({ stats }) => {
  const statItems = [
    {
      label: 'Total Perangkat',
      value: stats.total || 0,
      icon: FiMonitor,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
    },
    {
      label: 'Online',
      value: stats.online || 0,
      icon: FiWifi,
      color: 'bg-green-500',
      textColor: 'text-green-600',
    },
    {
      label: 'Offline',
      value: stats.offline || 0,
      icon: FiWifiOff,
      color: 'bg-gray-500',
      textColor: 'text-gray-600',
    },
    {
      label: 'Lost Mode',
      value: stats.lost || 0,
      icon: FiAlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
    },
    {
      label: 'Maintenance',
      value: stats.maintenance || 0,
      icon: FiTool,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {statItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{item.label}</p>
                <p className={`text-2xl font-bold ${item.textColor}`}>{item.value}</p>
              </div>
              <div className={`p-3 rounded-full ${item.color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${item.textColor}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DeviceStats;
