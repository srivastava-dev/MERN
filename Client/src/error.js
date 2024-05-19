import React from 'react';
import { useSelector } from 'react-redux';

const ErrorMessage = () => {
  const errorMessage = useSelector((state) => state.errorMessage);

  return (
    <div>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
