import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="mobile:px-2 tablet:px-4 laptop:px-8 computer:max-w-full mx-auto">
      {children}
    </div>
  );
};

export default Container;
