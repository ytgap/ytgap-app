import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <div className="w-16 h-16 border-4 border-brand-red border-t-transparent border-solid rounded-full animate-spin"></div>
      <p className="mt-6 text-xl font-semibold text-brand-off-white">
        Searching for Hidden Gems...
      </p>
      <p className="mt-2 text-brand-off-white/70">
        This powerful search may take a moment. Please be patient.
      </p>
      <div className="w-full max-w-md bg-brand-light-dark rounded-full h-2.5 mt-4 overflow-hidden">
        <div className="bg-brand-red h-2.5 rounded-full animate-progress"></div>
      </div>
      <style>
        {`
          @keyframes progress-indeterminate {
            0% { transform: translateX(-100%) scaleX(0.5); }
            100% { transform: translateX(100%) scaleX(0.5); }
          }
          .animate-progress {
            animation: progress-indeterminate 1.5s ease-in-out infinite;
            transform-origin: left center;
          }
        `}
      </style>
    </div>
  );
};

export default LoadingSpinner;