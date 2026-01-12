'use client';
import React from 'react';
import styled from 'styled-components';

const Big_Loading = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-black/30">
      <StyledWrapper>
        <div className="loader" />
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .loader {
    border: 4px solid #ffffff;
    border-left-color: transparent;
    border-radius: 50%;
  }

  .loader {
    border: 4px solid #ffffff;
    border-left-color: transparent;
    width: 100px;
    height: 100px;
  }

  .loader {
    border: 4px solid #ffffff;
    border-left-color: transparent;
    width: 100px;
    height: 100px;
    animation: spin89345 1s linear infinite;
  }

  @keyframes spin89345 {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
export default Big_Loading;
