'use client';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { GrClose } from 'react-icons/gr';

const ShowStatus = ({ story = [], onClose }) => {
  
  const storyRef = useRef(null);
  const videoRef = useRef(null);
  let [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(5000);

const currentStory = story[currentIndex]?.stories?.[0];
 

  //src file ta kaj aseh

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
        handleNext();
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentIndex, duration]);

  const handleNext = () => {
    if (currentIndex < story.length - 1) {
      setCurrentIndex(i => i + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    }
  };

  if (!currentStory) return null;

  return (
    <section className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div
        ref={storyRef}
        className="relative mobile:rounded-none computer:rounded-xl overflow-hidden shadow-2xl mobile:w-full tablet:w-full mobile:h-full tablet:h-full computer:w-130 computer:h-200 bg-black"
      >
        <div className="absolute top-0 left-0 w-full">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-12.5 h-12.5 rounded-full">
              <img
                className="w-full h-full rounded-full object-cover"
                src={story[0]?.user?.avatar}
                alt="user"
              />
            </div>
            <h3 className="text-sm font-inter text-white">
              {story[0]?.user?.name}
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
          src={currentStory?.video}
          autoPlay
          onLoadedMetadata={handleLoadedMetadata}
          className="w-full h-full object-cover bg-center"
        ></video>

        {currentIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {currentIndex < story.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white"
          >
            <ChevronRight size={32} />
          </button>
        )}

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
