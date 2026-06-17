'use client';

import { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

const StatusChart = ({ devices }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Calculate status counts
    const statusCounts = {
      online: devices.filter(d => d.status === 'online').length,
      offline: devices.filter(d => d.status === 'offline').length,
      lost: devices.filter(d => d.status === 'lost').length,
      maintenance: devices.filter(d => d.status === 'maintenance').length,
    };

    // Create chart
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Online', 'Offline', 'Lost Mode', 'Maintenance'],
        datasets: [
          {
            data: [
              statusCounts.online,
              statusCounts.offline,
              statusCounts.lost,
              statusCounts.maintenance,
            ],
            backgroundColor: [
              'rgba(34, 197, 94, 0.8)',
              'rgba(156, 163, 175, 0.8)',
              'rgba(239, 68, 68, 0.8)',
              'rgba(234, 179, 8, 0.8)',
            ],
            borderColor: [
              'rgb(34, 197, 94)',
              'rgb(156, 163, 175)',
              'rgb(239, 68, 68)',
              'rgb(234, 179, 8)',
            ],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
            },
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed / total) * 100).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              },
            },
          },
        },
        cutout: '70%',
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [devices]);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Status Perangkat</h3>
      <div className="h-64">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default StatusChart;
