'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCw, RotateCcw, Volume2, Zap } from 'lucide-react';

const SPEEDS = [1, 1.25, 1.5, 2];

export default function AudioPlayer({ src, autoPlay = false, className = '' }) {
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const rafRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [volume, setVolume] = useState(1);
  const [speedIndex, setSpeedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!src) return;

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    const audio = new Audio(src);
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      setIsLoaded(true);
      if (autoPlay) {
        audio.play().catch(() => {});
      }
    };

    const onTime = () => {
      setCurrent(audio.currentTime);
    };

    const onEnd = () => {
      setIsPlaying(false);
      setCurrent(audio.duration || 0);
      cancelAnimationFrame(rafRef.current);
    };

    const onError = e => {
      setError('Audio failed to load');
      console.error('Audio error', e);
    };

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('error', onError);

    audio.volume = volume;
    audio.playbackRate = SPEEDS[speedIndex];

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnd);
      audio.removeEventListener('error', onError);
      cancelAnimationFrame(rafRef.current);
    };
  }, [src]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = SPEEDS[speedIndex];
    }
  }, [speedIndex]);

  const togglePlay = async () => {
    if (!audioRef.current) return;
    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        cancelAnimationFrame(rafRef.current);
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        tick();
      }
    } catch (err) {
      console.error('Play failed', err);
      setError('Unable to play audio (permission or format issue)');
    }
  };

  const tick = () => {
    if (!audioRef.current) return;
    setCurrent(audioRef.current.currentTime || 0);
    rafRef.current = requestAnimationFrame(tick);
  };

  const seekTo = seconds => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      Math.min(seconds, audioRef.current.duration || 0)
    );
    setCurrent(audioRef.current.currentTime);
  };

  const handleProgressClick = e => {
    if (!progressRef.current || !audioRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const to = (audioRef.current.duration || 0) * pct;
    seekTo(to);
  };

  const formatTime = secs => {
    if (!secs || isNaN(secs)) return '0:00';
    const s = Math.floor(secs % 60)
      .toString()
      .padStart(2, '0');
    const m = Math.floor(secs / 60);
    return `${m}:${s}`;
  };

  const forward10 = () => {
    if (!audioRef.current) return;
    seekTo((audioRef.current.currentTime || 0) + 10);
  };

  const back10 = () => {
    if (!audioRef.current) return;
    seekTo((audioRef.current.currentTime || 0) - 10);
  };

  const toggleSpeed = () => {
    setSpeedIndex(i => (i + 1) % SPEEDS.length);
  };

  const toggleMute = () => setIsMuted(v => !v);

  useEffect(() => {
    const handler = e => {
      if (
        e.code === 'Space' &&
        document.activeElement?.dataset?.audioplayer !== undefined
      ) {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isPlaying]);

  const percent = duration
    ? Math.min(100, Math.max(0, (current / duration) * 100))
    : 0;

  return (
    <div className={`w-full max-w-[740px] ${className}`}>
      <div
        className="bg-white text-gray-900 rounded-xl shadow-md px-3 py-2 flex items-center gap-4"
        data-audioplayer="true"
      >
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-400/30 shadow-sm hover:bg-gray-100 focus:outline-none"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={back10}
            aria-label="Back 10 seconds"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            title="Back 10s"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={forward10}
            aria-label="Forward 10 seconds"
            className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
            title="Forward 10s"
          >
            <RotateCw size={18} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            onTouchStart={handleProgressClick}
            className="w-full h-3 rounded-md bg-gray-100 relative cursor-pointer"
            aria-label="Seek"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={current}
            tabIndex={0}
          >
            <div
              className="absolute left-0 top-0 h-3 rounded-md bg-blue-600"
              style={{ width: `${percent}%` }}
            />
            <div
              style={{ left: `${percent}%` }}
              className="absolute -translate-x-1/2 -top-1 w-3 h-5 rounded-full bg-blue-600"
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-3">
              <div className="flex md:hidden items-center gap-3">
                <button
                  onClick={back10}
                  aria-label="Back 10 seconds"
                  className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  <RotateCcw size={18} />
                </button>

                <button
                  onClick={togglePlay}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 shadow-sm hover:bg-gray-100 focus:outline-none"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button
                  onClick={forward10}
                  aria-label="Forward 10 seconds"
                  className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  <RotateCw size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-sm text-gray-600">
                {formatTime(current)} / {formatTime(duration)}
              </div>

              <button
                onClick={toggleSpeed}
                className="text-sm px-2 py-1 rounded hover:bg-gray-100 focus:outline-none"
                title={`Playback speed ${SPEEDS[speedIndex]}x`}
              >
                {SPEEDS[speedIndex]}x
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                  className="p-1 rounded hover:bg-gray-100 focus:outline-none"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  <Volume2 size={16} />
                </button>

                <input
                  aria-label="Volume"
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={e => {
                    setVolume(Number(e.target.value));
                    if (Number(e.target.value) === 0) setIsMuted(true);
                    else setIsMuted(false);
                  }}
                  className="w-20 h-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
    </div>
  );
}
