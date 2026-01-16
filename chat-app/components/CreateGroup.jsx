'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';

const CreateGroup = ({ setGroup }) => {
  let [image, setImage] = useState(null);
  let offRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalImage, setFinalImage] = useState(null);

  useEffect(() => {
    let handleCLickOutside = e => {
      if (offRef.current && !offRef.current.contains(e.target)) {
        setGroup(false);
      }
    };

    document.addEventListener('mousedown', handleCLickOutside);

    return () => {
      document.removeEventListener('mousedown', handleCLickOutside);
    };
  }, [setGroup]);

  let onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  let handleImageUpload = e => {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  let getCroppedImg = async () => {
    let img = new Image();
    img.src = image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let { width, height, x, y } = croppedAreaPixels;

    canvas.width = width;
    canvas.height = height;

    await new Promise(resolve => (img.onload = resolve));
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    const base64 = canvas.toDataURL('image/jpeg');
    setFinalImage(base64);
  };

  return (
    <div
      className="flex items-center justify-center h-screen w-full fixed top-0 left-0 bg-black/50 z-50"
      ref={offRef}
    >
      <div className="bg-white mobile:rounded-none tablet:rounded-none laptop:rounded-none computer:rounded-xl shadow-xl p-6 mobile:w-full mobile:h-screen tablet:w-full tablet:h-screen laptop:w-150 laptop:h-200 computer:w-150 computer:h-200 overflow-y-auto relative">
        <div className="flex items-center justify-between border-b border-gray-400 ">
          <h1 className="text-[28px] font-open_sens font-semibold text-black my-2">
            Create group
          </h1>
          <button className="text-[18px] font-open_sens font-semibold text-white bg-red-400 px-4 py-2 rounded-sm my-2">
            Cancel
          </button>
        </div>
        <div>
          <p>Group Name</p>
          <input type="text" />
        </div>
        <p>Add a group photo</p>
        <div className="image-upload">
          {!image && (
            <div
              onClick={() => document.getElementById('inputs').click()}
              className="border border-dashed border-gray-400 rounded-lg p-5 text-center"
            >
              <label className="text-gray-500 font-medium block mb-2">
                Upload Your Photo
              </label>
              <span className="text-sm text-gray-400 flex items-center-safe justify-center">
                Click Here
              </span>
              <input
                type="file"
                id="inputs"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          )}

          {image && !finalImage && (
            <div className="relative w-full h-87.5 bg-black rounded-lg overflow-hidden">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="round"
                showGrid={false}
              />
            </div>
          )}

          {image && !finalImage && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setImage(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={getCroppedImg}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white"
              >
                Save
              </button>
            </div>
          )}

          {image && !finalImage && (
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={e => setZoom(e.target.value)}
              className="w-full mt-4"
            />
          )}

          {image && !finalImage && (
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setImage(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg text-gray-700"
              >
                Cancel
              </button>

              <button
                onClick={getCroppedImg}
                className="px-4 py-2 bg-blue-600 rounded-lg text-white"
              >
                Save
              </button>
            </div>
          )}

          {finalImage && (
            <div className="flex flex-col items-center gap-4 mt-4">
              <img
                src={finalImage}
                className="w-40 h-40 rounded-full object-cover shadow-md"
              />
              <button
                onClick={() => {
                  setImage(null);
                  setFinalImage(null);
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Change Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateGroup;
