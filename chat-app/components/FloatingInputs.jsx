'use client';
import React, { useRef } from 'react';

function FloatingInput({ label, type, value, onChange, id }) {
  const inputRef = useRef(null);
  const labelRef = useRef(null);

  let handleFocus = () => {
    labelRef.current.classList.add(
      '-top-[10px]',
      'text-[14px]',
      'text-blue-400',
      'bg-white',
      'px-2',
      'rounded-[2px]'
    );
    labelRef.current.classList.remove(
      'top-1/2',
      '-translate-y-1/2',
      'text-white'
    );
  };

  let handleBlur = () => {
    if (inputRef.current.value === '') {
      labelRef.current.classList.remove(
        'text-[14px]',
        'text-blue-400',
        '-top-[10px]',
        'bg-white',
        'px-2',
        'rounded-[2px]'
      );
      labelRef.current.classList.add(
        'top-1/2',
        '-translate-y-1/2',
        'text-white'
      );
    }
  };
  return (
    <div className="relative w-full h-[60px] mb-[30px]">
      <input
        type={type}
        id={id}
        ref={inputRef}
        required
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={onChange}
        className="w-full h-full rounded-md border border-white bg-transparent px-4 text-[16px] font-semibold font-open_sens text-white outline-none focus:border-blue-500 transition-all duration-300"
      />
      <label
        ref={labelRef}
        htmlFor={id}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white transition-all duration-300 font-semibold font-open_sens"
      >
        {label}
      </label>
    </div>
  );
}

export default FloatingInput;
