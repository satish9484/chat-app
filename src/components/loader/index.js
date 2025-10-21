import React from 'react';
import './style.scss';

const Loading = ({ isSuspense, children }) => {
  const isLoading = false;

  return (
    <>
      {(isSuspense || isLoading) && (
        <div className="spinner-wrap">
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
        </div>
      )}
      {children}
    </>
  );
};

export default Loading;
