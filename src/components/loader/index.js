import './style.scss';

const Loading = ({ isSuspense, children }) => {
  const isLoading = true;

  return (
    <>
      {(isSuspense || isLoading) && (
        <div className="spinner-wrap">
          <div className="spinner">
            <div className="double-bounce1"></div>
            <div className="double-bounce2"></div>
          </div>
          {children}
        </div>
      )}
    </>
  );
};

export default Loading;
