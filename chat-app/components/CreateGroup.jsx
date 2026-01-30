'use client';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { TiTick } from 'react-icons/ti';
import { useGraphQL } from './Hook/useGraphQL';
import Loader from './Loader';
import { uploadToCloudinary } from '@/lib/cloudinaryClient';

const CreateGroup = ({ setGroup }) => {
  let { request, loading, error } = useGraphQL();
  let [friends, setFriends] = useState([]);
  let [members, setMembers] = useState([]);
  let [image, setImage] = useState(null);
  let [groupName, setGroupName] = useState('');
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

  useEffect(() => {
    let FetchMe = async () => {
      try {
        const query = `query {me {friends { id name avatar }}}`;

        const data = await request(query);
        console.log(data);
        setFriends(data.me.friends);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMe();
  }, []);

  let handleGroupSubmit = async () => {
    try {
      if (!groupName || !finalImage) return;

      let query = ` mutation CreateGroup($name: String!, $members: [ID!], $photo: String) {
      createGroup(name: $name, members: $members, photo: $photo) {
        id
        name
        photo
        Admin { id name email avatar }
        members { id name email avatar }
      }
    }
  `;
      let photoUrl = await uploadToCloudinary(
        finalImage,
        'group_photos',
        'image',
      );
      let data = await request(query, {
        name: groupName,
        members: members,
        photo: photoUrl,
      });
      if (data.createGroup) {
        setGroup(false);
        setGroupName('');
        setMembers([]);
        setImage(null);
        setFinalImage(null);
      }
    } catch (error) {
      console.log(error);
    }
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
          <button
            onClick={() => setGroup(false)}
            className="text-[18px] font-open_sens font-semibold text-white bg-red-400 px-4 py-2 rounded-sm my-2 cursor-pointer hover:opacity-70"
          >
            Cancel
          </button>
        </div>
        <div className="mobile:w-full tablet:w-full laptop:w-134 computer:w-134 h-12.5 rounded-md mb-3.5 mt-6 flex flex-col gap-1">
          <p className="text-[18px] font-medium font-inter text-black">
            Group Name
          </p>
          <input
            onChange={e => setGroupName(e.target.value)}
            className="w-full h-full text-[15px] rounded-md border border-gray-300 p-2 placeholder:text-gray-500 text-gray-500"
            placeholder="Enter Group Name..."
            type="text"
          />
        </div>

        <div className="image-upload">
          <p className="text-[18px] font-medium font-inter text-black mt-7.5 mb-2">
            Add a group photo
          </p>
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

        <div className="mt-6 ">
          <p className="text-lg font-semibold text-gray-800 mb-2">
            Add Friends
          </p>

          <input
            type="text"
            placeholder="Search friends to add..."
            className="mobile:w-full tablet:w-full laptop:w-134 computer:w-134 h-12.5 px-3 rounded-md text-gray-500 placeholder:text-gray-500 text-[15px] border border-gray-300 outline-none mb-4"
          />
          <div className="border border-gray-500 mobile:p-3 tablet:p-4 computer:p-4 rounded-md overflow-auto max-h-82.5">
            {friends.map((friend, index) => (
              <div
                key={index}
                className="flex items-center justify-between mt-3.5"
              >
                <div className="flex items-center gap-3">
                  <img
                    className="w-14 h-14 object-cover rounded-full"
                    src={friend.avatar || 'defult.png'}
                    alt="group"
                  />
                  <h5 className="text-[15px] font-semibold text-black">
                    {friend.name}
                  </h5>
                </div>

                <label className="group cursor-pointer">
                  <input
                    checked={members.includes(friend.id)}
                    type="checkbox"
                    onChange={e => {
                      if (e.target.checked) {
                        setMembers(prev => [...prev, friend.id]);
                      } else {
                        setMembers(prev => prev.filter(id => id !== friend.id));
                      }
                    }}
                    className="hidden"
                  />

                  <div
                    className="w-6 h-6 rounded-full border-2 border-gray-400
                  group-has-checked:bg-purple-500
                  group-has-checked:border-purple-500
                  flex items-center justify-center"
                  >
                    <TiTick className=" text-2xl text-white scale-0 rotate-45 group-has-checked:scale-100 group-has-checked:rotate-0 transition-all duration-200" />
                  </div>
                </label>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleGroupSubmit}
          className={`${loading ? ' bg-black text-white' : 'bg-purple-500 text-white'}  w-full h-10 flex items-center gap-3 justify-center text-center hover:opacity-80 rounded-md mt-4 cursor-pointer`}
        >
          Create Group {loading && <Loader />}
        </button>
      </div>
      {error && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-full text-sm animate-fadeIn">
          {error}
        </div>
      )}
    </div>
  );
};

export default CreateGroup;
