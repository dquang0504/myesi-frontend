import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };

  const spinnerClass = sizeClasses[size] || sizeClasses.medium;

  const content = (
    <div className="loading-content" role="status" aria-live="polite">
      <div className={`loading-spinner ${spinnerClass}`} aria-hidden="true">
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
        <div className="spinner-circle"></div>
      </div>
      {message && (
        <p className="loading-message">
          {message}
        </p>
      )}
      <span className="sr-only">Loading content, please wait</span>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="loading-container fullscreen">
        {content}
      </div>
    );
  }

  return (
    <div className="loading-container">
      {content}
    </div>
  );
};

export default LoadingSpinner;
