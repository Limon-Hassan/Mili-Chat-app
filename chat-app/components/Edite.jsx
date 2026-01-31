'use client';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import VoiceRecorder from './VoiceRecorder';
import { GrClose } from 'react-icons/gr';
import { uploadToCloudinary } from '@/lib/cloudinaryClient';
import { useGraphQL } from './Hook/useGraphQL';
import Loader from './Loader';
import { TiTick } from 'react-icons/ti';

const Edite = ({ setActive, onClose = () => {} }) => {
  let { request, loading, error } = useGraphQL();
  const [image, setImage] = useState(null);
  let offRef = useRef(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [privacy, setPrivacy] = useState({
    storyPrivacy: '',
    friendPrivacy: '',
    ownVoicePrivacy: '',
    profilePicLock: false,
  });
  const [Audio, setAudio] = useState(null);
  let [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    const handleClickOutside = e => {
      if (offRef.current && !offRef.current.contains(e.target)) {
        setActive(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setActive]);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async () => {
    const img = new Image();
    img.src = image;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const { width, height, x, y } = croppedAreaPixels;

    canvas.width = width;
    canvas.height = height;

    await new Promise(resolve => (img.onload = resolve));
    ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

    const base64 = canvas.toDataURL('image/jpeg');
    setFinalImage(base64);
  };

  let handleSubmit = async () => {
    try {
      if (finalImage) {
        let picURL = await uploadToCloudinary(
          finalImage,
          'profile_pics',
          'image',
        );
        let mutation = `
mutation UploadProfilePic($profilePic: String!) {
  uploadProfilePic(profilePic: $profilePic) {
    id
    name
    email
    avatar
    bio
  }
}
`;

        let data = await request(mutation, { profilePic: picURL });
        console.log(data);
        if (data.uploadProfilePic) {
          setFinalImage(null);
        }
      }

      if (formData.name || formData.bio) {
        let mutation = `mutation UpdateProfile($name: String, $bio: String) { updateProfile(name: $name, bio: $bio) {
    id
    name
    bio
    avatar
    }
    }
    `;

        let data = await request(mutation, formData);

        if (data.updateProfile) {
          setFormData({
            name: data.updateProfile.name,
            bio: data.updateProfile.bio,
          });
        }
      }

      if (Audio) {
        let AudioURL = await uploadToCloudinary(Audio, 'profile_pics', 'video');
        let mutation = `mutation AddOwnVoice($voice: String!) {
        addOwnVoice(voice: $voice ) {
    id
    voiceIntro{
    url
    }
    }}
`;

        let data = await request(mutation, {
          voice: AudioURL,
        });

        if (data.addOwnVoice) {
          setAudio(null);
        }
      }
      if (privacy) {
        let mutation = `mutation UpdatePrivacy(
  $storyPrivacy: String
  $friendPrivacy: String
  $ownVoicePrivacy: String
  $profilePicLock: Boolean
) {
  updatedPrivacy(
    storyPrivacy: $storyPrivacy
    friendPrivacy: $friendPrivacy
    ownVoicePrivacy: $ownVoicePrivacy
    profilePicLock: $profilePicLock
  ) {
    id
    storyPrivacy
    friendListPrivacy
    OwnVoicePrivacy
    ProfilePicLock
  }
}`;

        let data = await request(mutation, privacy);
        if (data.updatedPrivacy) {
          setPrivacy({
            storyPrivacy: data.updatedPrivacy.storyPrivacy,
            friendPrivacy: data.updatedPrivacy.friendListPrivacy,
            ownVoicePrivacy: data.updatedPrivacy.OwnVoicePrivacy,
            profilePicLock: data.updatedPrivacy.ProfilePicLock,
          });
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setActive(false);
      onClose();
    }
  };

  return (
    <>
      <section className="flex items-center justify-center h-screen w-full fixed top-0 left-0 bg-black/50 z-50">
        <div
          ref={offRef}
          className="bg-white mobile:rounded-none tablet:rounded-none laptop:rounded-none computer:rounded-xl shadow-xl p-6 mobile:w-full mobile:h-screen tablet:w-full tablet:h-screen laptop:w-150 laptop:h-200 computer:w-150 computer:h-200 overflow-y-auto relative"
        >
          <h4 className="flex items-center justify-between text-2xl font-semibold text-gray-700 mb-4">
            Edit Your Profile
            <span onClick={onClose} className="cursor-pointer">
              <GrClose size={24} />
            </span>
          </h4>

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
          <div className="mt-3.5">
            <input
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-12.5 rounded-lg px-3 border border-gray-300  placeholder:text-gray-500 text-gray-700 font-semibold font-inter outline-none shadow-[0_15px_16px_rgba(0,0,0,0.12)] focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 bg-white"
              type="text"
              value={formData.name}
              placeholder="Your name..."
            />
          </div>

          <div className="mt-3.5">
            <input
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full h-12.5 rounded-lg px-3 border border-gray-300  placeholder:text-gray-500 text-gray-700 font-semibold font-inter outline-none shadow-[0_15px_16px_rgba(0,0,0,0.12)] focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-200 bg-white"
              type="text"
              value={formData.bio}
              placeholder="Your bio..."
            />
          </div>
          <div className="mt-3.5">
            <span className="text-[16px] font-inter font-semibold text-gray-500">
              Make your Own voice
            </span>
            <VoiceRecorder onSave={setAudio} />
          </div>
          <div className="mt-3.5">
            <span className="text-[16px] font-inter font-semibold text-gray-500">
              Edit your additional info <span className="text-red-600">*</span>
            </span>
          </div>
          <div className="mt-3.5">
            <span className="text-[16px] font-inter font-semibold text-gray-500">
              Who can see your Status ?
            </span>
            <select
              value={privacy.storyPrivacy}
              onChange={e =>
                setPrivacy({ ...privacy, storyPrivacy: e.target.value })
              }
              className="w-full h-12.5 mt-2 rounded-lg px-3 border border-gray-300  placeholder:text-gray-500 text-gray-700 font-semibold font-inter outline-none shadow-[0_15px_16px_rgba(0,0,0,0.12)] focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white"
            >
              <option value="public">Everyone</option>
              <option value="friends">My Friends</option>
              <option value="onlyMe">Only Me</option>
            </select>
          </div>
          <div className="mt-3.5">
            <span className="text-[16px] font-inter font-semibold text-gray-500">
              Who can see your Friend List ?
            </span>
            <select
              value={privacy.friendPrivacy}
              onChange={e =>
                setPrivacy({ ...privacy, friendPrivacy: e.target.value })
              }
              className="w-full h-12.5 mt-2 rounded-lg px-3 border border-gray-300  placeholder:text-gray-500 text-gray-700 font-semibold font-inter outline-none shadow-[0_15px_16px_rgba(0,0,0,0.12)] focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white"
            >
              <option value="public">Everyone</option>
              <option value="friends">My Friends</option>
              <option value="onlyMe">Only Me</option>
            </select>
          </div>
          <div className="mt-3.5 mb-12.5">
            <span className="text-[16px] font-inter font-semibold text-gray-500">
              Who can listen your Own voice ?
            </span>
            <select
              value={privacy.ownVoicePrivacy}
              onChange={e =>
                setPrivacy({ ...privacy, ownVoicePrivacy: e.target.value })
              }
              className="w-full h-12.5 mt-2 rounded-lg px-3 border border-gray-300  placeholder:text-gray-500 text-gray-700 font-semibold font-inter outline-none shadow-[0_15px_16px_rgba(0,0,0,0.12)] focus:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-all duration-300 bg-white"
            >
              <option value="public">Everyone</option>
              <option value="friends">My Friends</option>
              <option value="onlyMe">Only Me</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <h5
              onClick={() => document.getElementById('input').click()}
              className="text-[16px] font-inter font-semibold text-gray-500"
            >
              Do you want to lock your profile Picture, so click here
            </h5>
            <label className="group cursor-pointer">
              <input
                checked={privacy.profilePicLock}
                onChange={e =>
                  setPrivacy({ ...privacy, profilePicLock: e.target.checked })
                }
                id="input"
                type="checkbox"
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
          <button
            onClick={handleSubmit}
            className="text-[16px] font-semibold font-inter text-white bg-purple-500 w-full cursor-pointer py-2 rounded-md mt-6 flex items-center justify-center mx-auto gap-3"
          >
            Save {loading && <Loader />}
          </button>
        </div>
      </section>
    </>
  );
};

export default Edite;
