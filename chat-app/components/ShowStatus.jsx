'use client';
import React, { useEffect, useRef, useState } from 'react';
import { GrClose } from 'react-icons/gr';

const ShowStatus = ({ src, onClose }) => {
  const storyRef = useRef(null);
  const videoRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(5000);

  useEffect(() => {
    const handleClickOutside = e => {
      if (storyRef.current && !storyRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  useEffect(() => {
    const escClose = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', escClose);
    return () => window.removeEventListener('keydown', escClose);
  }, [onClose]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration * 1000);
    }
  };

  useEffect(() => {
    let start = Date.now();
    const timer = setInterval(() => {
      const diff = Date.now() - start;
      const p = Math.min((diff / duration) * 100, 100);
      setProgress(p);

      if (p === 100) {
        onClose();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <section className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div
        ref={storyRef}
        className="relative rounded-xl overflow-hidden shadow-2xl w-[520px] h-[800px] bg-black"
      >
        <div className="absolute top-0 left-0 w-full">
          <div className='flex items-center gap-2 mb-5'>
            <div className="w-[50px] h-[50px] rounded-full">
              <img
                className="w-full h-full rounded-full object-cover"
                src="/Image.jpg"
                alt="user"
              />
            </div>
            <h3 className="text-sm font-inter text-white">
              Mahammud Hassan Limon
            </h3>
          </div>
          <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-75"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <video
          ref={videoRef}
          src={src}
          autoPlay
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover bg-center"
        ></video>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 cursor-pointer"
        >
          <GrClose size={24} />
        </button>
      </div>
    </section>
  );
};

export default ShowStatus;
