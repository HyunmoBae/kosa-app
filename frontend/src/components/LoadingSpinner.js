import React from 'react';

function LoadingSpinner({ fullScreen }) {
  const spinnerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50'
    : 'flex items-center justify-center p-4';

  return (
    <div className={spinnerClasses}>
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-primary-200 animate-spin">
          <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-t-4 border-primary-600"></div>
        </div>
        <span className="sr-only">로딩 중...</span>
      </div>
    </div>
  );
}

export default LoadingSpinner; 