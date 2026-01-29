'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Pencil, X, Save } from 'lucide-react';

export default function AddStory({ onClose = () => {}, onSave = () => {} }) {
  const editorRef = useRef(null);
  const [videoFile, setVideoFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const videoUrl = useRef(null);
  const imageUrl = useRef(null);
  const videoElRef = useRef(null);
  const imageElRef = useRef(null);

  const [imgTransform, setImgTransform] = useState({
    x: 0,
    y: 0,
    scale: 1,
    rotate: 0,
  });

  const gestureRef = useRef({
    mode: null,
    startDist: 0,
    startAngle: 0,
    startScale: 1,
    startRotate: 0,
    startX: 0,
    startY: 0,
  });

  const [overlays, setOverlays] = useState([]);
  const nextId = useRef(1);

  const [bg, setBg] = useState('black'); // 'red' | 'blue' | 'radiant' | 'black'

  const dragState = useRef({
    id: null,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  const DEFAULT_DURATION = 3;

  const handleVideoUpload = e => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (imageUrl.current) {
      URL.revokeObjectURL(imageUrl.current);
      imageUrl.current = null;
      setImageFile(null);
    }
    if (videoUrl.current) URL.revokeObjectURL(videoUrl.current);
    videoUrl.current = URL.createObjectURL(f);
    setVideoFile(f);
  };

  //just new addded

  const handleImageUpload = e => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (videoUrl.current) {
      URL.revokeObjectURL(videoUrl.current);
      videoUrl.current = null;
      setVideoFile(null);
    }
    if (imageUrl.current) URL.revokeObjectURL(imageUrl.current);

    imageUrl.current = URL.createObjectURL(f);
    setImageFile(f);

    requestAnimationFrame(() => {
      const rect = editorRef.current.getBoundingClientRect();
      setImgTransform({
        x: rect.width / 2,
        y: rect.height / 2,
        scale: 1,
        rotate: 0,
      });
    });
  };

  const getDistance = (t1, t2) =>
    Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);

  const getAngle = (t1, t2) =>
    (Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180) /
    Math.PI;

  const handleImageTouchStart = e => {
    if (e.touches.length === 2) {
      const [t1, t2] = e.touches;
      gestureRef.current = {
        mode: 'pinch',
        startDist: getDistance(t1, t2),
        startAngle: getAngle(t1, t2),
        startScale: imgTransform.scale,
        startRotate: imgTransform.rotate,
      };
    } else if (e.touches.length === 1) {
      const t = e.touches[0];
      gestureRef.current = {
        mode: 'drag',
        startX: t.clientX - imgTransform.x,
        startY: t.clientY - imgTransform.y,
      };
    }
  };

  const handleImageTouchMove = e => {
    e.preventDefault();
    if (gestureRef.current.mode === 'drag' && e.touches.length === 1) {
      const t = e.touches[0];
      setImgTransform(prev => ({
        ...prev,
        x: t.clientX - gestureRef.current.startX,
        y: t.clientY - gestureRef.current.startY,
      }));
    }

    if (gestureRef.current.mode === 'pinch' && e.touches.length === 2) {
      const [t1, t2] = e.touches;
      const dist = getDistance(t1, t2);
      const angle = getAngle(t1, t2);

      setImgTransform(prev => ({
        ...prev,
        scale: Math.min(
          3,
          Math.max(
            0.3,
            gestureRef.current.startScale *
              (dist / gestureRef.current.startDist)
          )
        ),
        rotate:
          gestureRef.current.startRotate +
          (angle - gestureRef.current.startAngle),
      }));
    }
  };

  const handleImageTouchEnd = () => {
    gestureRef.current.mode = null;
  };

  const addOverlay = () => {
    const id = nextId.current++;
    setOverlays(prev => [
      ...prev,
      { id, text: '', x: 200, y: 250, editing: true },
    ]);
  };

  const removeOverlay = id => {
    setOverlays(prev => prev.filter(o => o.id !== id));
  };

  const updateOverlay = (id, patch) => {
    setOverlays(prev => prev.map(o => (o.id === id ? { ...o, ...patch } : o)));
  };

  const handlePointerDown = (e, id) => {
    e.stopPropagation();
    const target = e.touches ? e.touches[0] : e;
    const overlayEl = document.getElementById(`overlay-${id}`);
    if (!overlayEl) return;
    const rect = overlayEl.getBoundingClientRect();
    dragState.current = {
      id,
      offsetX: target.clientX - rect.left,
      offsetY: target.clientY - rect.top,
      dragging: true,
    };
  };

  const handlePointerMoveGlobal = e => {
    if (!dragState.current.dragging) return;
    const target = e.touches ? e.touches[0] : e;
    const id = dragState.current.id;
    const editorRect = editorRef.current.getBoundingClientRect();
    let newX = target.clientX - editorRect.left - dragState.current.offsetX;
    let newY = target.clientY - editorRect.top - dragState.current.offsetY;
    newX = Math.max(8, Math.min(editorRect.width - 8, newX));
    newY = Math.max(8, Math.min(editorRect.height - 8, newY));
    updateOverlay(id, { x: newX, y: newY });
  };

  const handlePointerUpGlobal = () => {
    dragState.current.dragging = false;
    dragState.current.id = null;
  };

  useEffect(() => {
    window.addEventListener('mousemove', handlePointerMoveGlobal);
    window.addEventListener('mouseup', handlePointerUpGlobal);
    window.addEventListener('touchmove', handlePointerMoveGlobal, {
      passive: false,
    });
    window.addEventListener('touchend', handlePointerUpGlobal);
    return () => {
      window.removeEventListener('mousemove', handlePointerMoveGlobal);
      window.removeEventListener('mouseup', handlePointerUpGlobal);
      window.removeEventListener('touchmove', handlePointerMoveGlobal);
      window.removeEventListener('touchend', handlePointerUpGlobal);
    };
  }, []);

  const drawFrameToCanvas = (ctx, width, height, time) => {
    ctx.clearRect(0, 0, width, height);

    if (videoFile && videoElRef.current?.readyState >= 2) {
      try {
        ctx.drawImage(videoElRef.current, 0, 0, width, height);
      } catch (e) {}
    } else if (imageFile && imageElRef.current) {
      const img = imageElRef.current;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = width / height;
      let drawW = width,
        drawH = height,
        sx = 0,
        sy = 0,
        sW = img.naturalWidth,
        sH = img.naturalHeight;
      if (imgRatio > canvasRatio) {
        const desiredW = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - desiredW) / 2;
        sW = desiredW;
      } else {
        const desiredH = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - desiredH) / 2;
        sH = desiredH;
      }
      ctx.drawImage(img, sx, sy, sW, sH, 0, 0, drawW, drawH);
    } else {
      if (bg === 'red') {
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, 0, width, height);
      } else if (bg === 'blue') {
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(0, 0, width, height);
      } else if (bg === 'radiant') {
        const g = ctx.createLinearGradient(0, 0, width, height);
        g.addColorStop(0, '#7c3aed');
        g.addColorStop(1, '#ec4899');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);
      }
    }

    overlays.forEach(o => {
      const fontSize = 36;
      ctx.font = `${fontSize}px sans-serif`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      const x = o.x;
      const y = o.y;
      const lines = (o.text || '').split('\n');
      const padding = 8;
      let maxLineW = 0;
      lines.forEach(line => {
        const w = ctx.measureText(line).width;
        if (w > maxLineW) maxLineW = w;
      });
      const boxW = maxLineW + padding * 2;
      const boxH = lines.length * (fontSize + 6) + padding * 2;
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(x - padding, y - padding, boxW, boxH);
      ctx.fillStyle = '#ffffff';
      lines.forEach((line, idx) => {
        const ty = y + idx * (fontSize + 6) + fontSize;
        ctx.fillText(line, x, ty);
      });
    });
  };

  // const handleSave = async () => {
  //   if (isSaving) return;
  //   setIsSaving(true);
  //   setProgress(0);

  //   const editorRect = editorRef.current.getBoundingClientRect();
  //   const width = Math.max(480, Math.round(editorRect.width));
  //   const height = Math.max(640, Math.round(editorRect.height));

  //   const canvas = document.createElement('canvas');
  //   canvas.width = width;
  //   canvas.height = height;
  //   const ctx = canvas.getContext('2d');

  //   let duration = DEFAULT_DURATION;
  //   if (videoFile && videoElRef.current?.duration) {
  //     const d = Number(videoElRef.current.duration);
  //     if (!isNaN(d) && d > 0) duration = d;
  //   }

  //   const stream = canvas.captureStream(30);
  //   const options = { mimeType: 'video/webm; codecs=vp8' };
  //   const recorder = new MediaRecorder(stream, options);

  //   const chunks = [];
  //   recorder.ondataavailable = e => {
  //     if (e.data && e.data.size > 0) chunks.push(e.data);
  //   };

  //   recorder.start();

  //   let startTime = performance.now();
  //   let rafId;

  //   const drawLoop = now => {
  //     const elapsed = (now - startTime) / 1000;
  //     drawFrameToCanvas(ctx, width, height, elapsed);
  //     setProgress(Math.min(100, (elapsed / duration) * 100));

  //     if (elapsed < duration) {
  //       rafId = requestAnimationFrame(drawLoop);
  //     } else {
  //       try {
  //         recorder.stop();
  //       } catch (err) {}
  //       cancelAnimationFrame(rafId);
  //     }
  //   };

  //   if (videoElRef.current) {
  //     try {
  //       videoElRef.current.currentTime = 0;
  //     } catch (e) {}
  //     videoElRef.current.muted = false;
  //     videoElRef.current.play().catch(() => {});
  //   }

  //   startTime = performance.now();
  //   rafId = requestAnimationFrame(drawLoop);

  //   recorder.onstop = () => {
  //     const blob = new Blob(chunks, { type: 'video/webm' });
  //     setIsSaving(false);
  //     setProgress(100);

  //     onSave(blob, `story-${Date.now()}.webm`);
  //   };

  //   setTimeout(() => {
  //     if (recorder.state === 'recording') {
  //       try {
  //         recorder.stop();
  //       } catch (e) {}
  //     }
  //   }, duration  * 1000);
  // };


  const handleSave = async () => {
    if (isSaving) return;
    setIsSaving(true);
    setProgress(0);

    const editorRect = editorRef.current.getBoundingClientRect();
    const width = Math.max(480, Math.round(editorRect.width));
    const height = Math.max(640, Math.round(editorRect.height));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    let duration = DEFAULT_DURATION;
    if (videoFile && videoElRef.current?.duration) {
      const d = Number(videoElRef.current.duration);
      if (!isNaN(d) && d > 0) duration = d;
    }

    const canvasStream = canvas.captureStream(30);

  
    let audioTracks = [];

    if (videoElRef.current) {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaElementSource(videoElRef.current);
      const destination = audioContext.createMediaStreamDestination();

      source.connect(destination);
      source.connect(audioContext.destination);

      audioTracks = destination.stream.getAudioTracks();
    }

    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioTracks,
    ]);

    const recorder = new MediaRecorder(combinedStream, {
      mimeType: 'video/webm; codecs=vp8,opus',
    });

    const chunks = [];
    recorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.start();

    let startTime = performance.now();
    let rafId;

    const drawLoop = now => {
      const elapsed = (now - startTime) / 1000;
      drawFrameToCanvas(ctx, width, height, elapsed);
      setProgress(Math.min(100, (elapsed / duration) * 100));

      if (elapsed < duration) {
        rafId = requestAnimationFrame(drawLoop);
      } else {
        try {
          recorder.stop();
        } catch (err) {}
        cancelAnimationFrame(rafId);
      }
    };

    if (videoElRef.current) {
      try {
        videoElRef.current.currentTime = 0;
      } catch (e) {}
      videoElRef.current.muted = false;
      videoElRef.current.play().catch(() => {});
    }

    startTime = performance.now();
    rafId = requestAnimationFrame(drawLoop);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setIsSaving(false);
      setProgress(100);

      onSave(blob, `story-${Date.now()}.webm`);
      
    };

    setTimeout(() => {
      if (recorder.state === 'recording') {
        try {
          recorder.stop();
        } catch (e) {}
      }
    }, duration * 1000);
  };

  return (
    <div className="fixed w-full inset-0 z-50 flex items-center justify-center bg-black/70 mobile:p-0 tablet:p-0 laptop:p-0 computer:p-4">
      <div
        ref={editorRef}
        className="relative mobile:w-full mobile:h-full tablet:w-full tablet:h-screen laptop:w-full laptop:h-screen computer:w-105 computer:h-180 bg-black rounded-xl overflow-hidden shadow-2xl"
      >
        <div className="absolute top-3 left-3 z-40 flex gap-2">
          <label className="cursor-pointer text-white/90 bg-white/10 px-2 py-1 rounded">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            Image
          </label>
          <label className="cursor-pointer text-white/90 bg-white/10 px-2 py-1 rounded">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            Video
          </label>
        </div>

        <div className="absolute top-3 right-3 z-40 flex gap-2">
          <button
            onClick={() => {
              addOverlay();
            }}
            className="bg-white/10 text-white px-2 py-1 rounded flex items-center gap-1"
          >
            <Pencil size={24} />
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !videoFile && !imageFile}
            className="bg-green-600 text-white px-3 py-1 rounded flex items-center gap-2"
          >
            <Save size={14} />
            {isSaving ? `Saving ${Math.round(progress)}%` : 'Save'}
          </button>
          <button
            onClick={onClose}
            className="bg-white/10 text-white px-2 py-1 rounded"
          >
            
            <X size={16} />
          </button>
        </div>

        <div className="w-full h-full relative">
          {videoFile && (
            <video
              ref={videoElRef}
              src={videoUrl.current}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              loop
            />
          )}
          {!videoFile && imageFile && (
            <img
              ref={imageElRef}
              src={imageUrl.current}
              alt="preview"
              onTouchStart={handleImageTouchStart}
              onTouchMove={handleImageTouchMove}
              onTouchEnd={handleImageTouchEnd}
              style={{
                position: 'absolute',
                left: imgTransform.x,
                top: imgTransform.y,
                transform: `translate(-50%, -50%) scale(${imgTransform.scale}) rotate(${imgTransform.rotate}deg)`,
                maxWidth: '90%',
                maxHeight: '90%',
                touchAction: 'none',
                userSelect: 'none',
              }}
            />
          )}
          {!videoFile && !imageFile && (
            <div
              className={`absolute inset-0 ${
                bg === 'radiant'
                  ? 'bg-linear-to-br from-purple-500 to-pink-500'
                  : bg === 'red'
                  ? 'bg-red-600'
                  : bg === 'blue'
                  ? 'bg-blue-600'
                  : 'bg-black'
              }`}
            ></div>
          )}

          {overlays.map(o => (
            <div
              key={o.id}
              id={`overlay-${o.id}`}
              style={{
                position: 'absolute',
                left: `${o.x}px`,
                top: `${o.y}px`,
                transform: 'translate(0,0)',
                cursor: 'grab',
                zIndex: 50,
              }}
              onMouseDown={e => handlePointerDown(e, o.id)}
              onTouchStart={e => handlePointerDown(e, o.id)}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'inline-block',
                  minWidth: 120,
                }}
              >
                <button
                  onClick={ev => {
                    ev.stopPropagation();
                    removeOverlay(o.id);
                  }}
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -8,
                    background: '#FFFFFF',
                    color: '#000000',
                    borderRadius: 999,
                    width: 22,
                    height: 22,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 60,
                  }}
                >
                  ✕
                </button>
                <div
                  contentEditable
                  suppressContentEditableWarning
                  ref={el => {
                    if (el && !el._initialized) {
                      el.innerText = o.text || 'Tap to edit...';
                      el._initialized = true;
                    }
                  }}
                  onInput={e =>
                    updateOverlay(o.id, { text: e.currentTarget.innerText })
                  }
                  style={{
                    padding: '8px 12px',
                    color: '#fff',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 8,
                    minWidth: 120,
                    maxWidth: 260,
                    fontSize: 22,
                    outline: 'none',
                  }}
                ></div>

                {/* <div
                  contentEditable
                  suppressContentEditableWarning
                  onInput={e =>
                    updateOverlay(o.id, { text: e.currentTarget.innerText })
                  }
                  style={{
                    padding: '8px 12px',
                    color: '#fff',
                    background: 'rgba(0,0,0,0.25)',
                    borderRadius: 8,
                    minWidth: 120,
                    maxWidth: 260,
                    fontSize: 22,
                    outline: 'none',
                  }}
                >
                  {o.text || 'Tap to edit...'}
                </div> */}
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-3">
          <div className="flex gap-2">
            <div
              onClick={() => setBg('red')}
              className="w-7 h-7 rounded-full bg-red-600 cursor-pointer"
            />
            <div
              onClick={() => setBg('blue')}
              className="w-7 h-7 rounded-full bg-blue-600 cursor-pointer"
            />
            <div
              onClick={() => setBg('radiant')}
              className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 cursor-pointer"
            />
            <div
              onClick={() => setBg('black')}
              className="w-7 h-7 rounded-full bg-black cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
