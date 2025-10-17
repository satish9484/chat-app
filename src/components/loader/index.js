import React from 'react';
// import { useSelector } from 'react-redux';
import './style.scss';

const Loading = ({ isSuspense, children }) => {
  // const isLoading = useSelector(s => s?.api?.loading);
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
