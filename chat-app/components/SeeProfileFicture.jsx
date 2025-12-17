'use client';

import { Download, Forward } from 'lucide-react';
import React, { useState } from 'react';
import { GrClose } from 'react-icons/gr';

const SeeProfileFicture = ({ src, onClose }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = src; 
    link.download = 'profile-picture.jpg'; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <section className="fixed inset-0 bg-gray-800/98 flex items-center justify-center z-50">
      <div className="realative">
        <div className="flex items-center gap-5 absolute top-5 right-5">
          <button onClick={handleDownload} className="cursor-pointer">
            <Download size={24} />
          </button>
          <button className="cursor-pointer">
            <Forward size={24} />
          </button>
          <button className="cursor-pointer" onClick={onClose}>
            <GrClose size={24} />
          </button>
        </div>
        <div className="mobile:w-full mobile:h-auto tablet:w-full tablet:h-auto laptop:w-[90vw] laptop:h-[80vh] computer:w-[90vh] computer:h-[90vh] overflow-hidden rounded-md">
          <img
            className="w-full h-full object-cover rounded-md"
            src={src}
            alt="user"
          />
        </div>
      </div>
    </section>
  );
};

export default SeeProfileFicture;
