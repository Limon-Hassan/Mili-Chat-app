'use client';

import React, { useState } from 'react';
import VoiceChatCard from './VoiceChatCard';
import AllFriend from './AllFriend';
import { Plus } from 'lucide-react';
import { RiEdit2Fill } from 'react-icons/ri';
import Stories from './Stories';
import { IoPersonAddSharp } from 'react-icons/io5';
import Edite from './Edite';
import ShowStatus from './ShowStatus';
import SeeProfileFicture from './SeeProfileFicture';
import AddStory from './AddStory';

const Setting = () => {
  const [active, setActive] = useState({
    status: false,
    story: false,
    picture: false,
    StoryUpload: false,
    edite: false,
    ImageToggole: false,
  });

  let toggoleActive = key => {
    setActive(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <section className="w-300 p-5 bg-gray-400/30 rounded-lg border border-gray-300">
        <div className="border-b border-gray-400">
          <h2 className="text-[34px] font-bold font-inter text-white">
            Account
          </h2>
          <p className="text-lg font-normal font-inter text-gray-200 mb-5">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <div className="mt-10 flex flex-col mx-auto gap-5 p-5 overflow-y-auto h-[75vh] ">
          <div className="relative">
            <button
              onClick={() => toggoleActive('edite')}
              className="absolute top-0 right-0 flex items-center gap-1 text-white bg-purple-600 rounded-md px-3 py-2 hover:bg-purple-700 cursor-pointer font-semibold text-[16px]"
            >
              <RiEdit2Fill /> Edite
            </button>
            <div
              onClick={() => toggoleActive('ImageToggole')}
              className="w-[300px] h-[300px] border-[6px] rounded-full border-purple-600 overflow-hidden"
            >
              <img
                className="w-full h-full rounded-full object-cover active:scale-110 ease-in-out transition-all duration-500"
                src="/Image.jpg"
                alt="Image"
              />
            </div>
            <div className={`${active.ImageToggole ? 'block' : 'hidden'} absolute left-[150px] `}>
              <div className="relative bg-white text-black p-2 rounded-lg w-44 before:absolute before:-top-2 before:left-6 before:w-0 before:h-0 before:border-l-8 before:border-r-8 before:border-b-8 before:border-l-transparent before:border-r-transparent before:border-b-white">
                <ul>
                  <li
                    onClick={() => toggoleActive('story')}
                    className="cursor-pointer hover:bg-gray-300 active:bg-gray-300 font-medium p-1 rounded-sm"
                  >
                    See story
                  </li>
                  <li
                    onClick={() => toggoleActive('picture')}
                    className="cursor-pointer hover:bg-gray-300 active:bg-gray-300 font-medium p-1 rounded-sm"
                  >
                    See profile picture
                  </li>
                </ul>
              </div>
            </div>
            <span onClick={() => toggoleActive('StoryUpload')} className="absolute bottom-0 left-0 w-[50px] h-[50px] bg-purple-600 flex items-center justify-center rounded-full cursor-pointer border border-gray-500">
              <Plus />
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-gray-400 pb-5">
            <div>
              <h3 className="uppercase flex items-center gap-3.5 text-2xl font-bold font-inter text-white">
                mahammud hassan limon
                <span className="flex items-center gap-1 text-sm bg-gray-700 w-[120px] justify-center h-10 border border-gray-500 rounded-full">
                  Creator
                  <img
                    className=" h-6 object-contain bg-center "
                    src="/verified-account.png"
                    alt="verify"
                  />
                </span>
              </h3>
              <h3 className="text-sm font-normal font-inter text-white mt-3.5">
                I'm Full stack Developer || Web Designer || MERN stack Developer
              </h3>
              <button className="flex items-center gap-1 text-md font-inter font-semibold text-white bg-purple-500 px-4 py-2 rounded-full mt-4 hover:bg-purple-600 cursor-pointer">
                <span>
                  <IoPersonAddSharp />
                </span>
                Add Friend
              </button>
            </div>
            <div>
              <VoiceChatCard
                audioSrc="/Sayfalse  Nulteex - AL NACER!.mp3"
                status="online"
              />
            </div>
          </div>
          <AllFriend />
          <Stories />
          {active.edite && <Edite setActive={setActive} />}
          {active.StoryUpload && <AddStory onClose={()=> setActive(false)} />}
          {active.story && (
            <ShowStatus src="/kawasaki.mp4" onClose={() => setActive(false)} />
          )}
          {active.picture && (
            <SeeProfileFicture
              src="/Image.jpg"
              onClose={() => setActive(false)}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default Setting;
