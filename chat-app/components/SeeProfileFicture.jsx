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
    <section className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
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
        <div className="w-[90vw] h-[80vh] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] ">
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
