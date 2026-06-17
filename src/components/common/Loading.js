'use client';

const Loading = ({ fullScreen = false, text = 'Memuat...' }) => {
  const container = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={container}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        {text && <p className="text-gray-500 text-sm">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;
