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
import BlockUser from './BlockUser';
import useMobileHeight from './Hook/useMobileHeight';

const MobileSetting = () => {
  const [active, setActive] = useState({
    status: false,
    story: false,
    picture: false,
    StoryUpload: false,
    edite: false,
    ImageToggole: false,
  });

  let mobileHeight = useMobileHeight();

  let toggoleActive = key => {
    setActive(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <>
      <section className="mobile:w-full tablet:w-full laptop:w-full p-2 bg-gray-400/30 rounded-lg border border-gray-300 mobile:absolute mobile:top-27.5 mobile:left-0 tablet:absolute tablet:top-27.5 tablet:left-0 laptop:absolute laptop:top-27.5 laptop:left-0 ">
        <div className="border-b border-gray-400">
          <h2 className="text-[34px] font-bold font-inter text-white">
            Account
          </h2>
          <p className="mobile:text-sm tablet:text-lg laptop:text-lg font-normal font-inter text-gray-200 mobile:mb-2 tablet:mb-3 laptop:mb-5">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <div
          className="mobile:mt-6 tablet:mt-10 laptop:mt-10 flex flex-col mx-auto gap-5 p-2 overflow-y-auto"
          style={{
            height: mobileHeight ? `${mobileHeight}vh` : '100dvh',
          }}
        >
          <div className="relative">
            <button
              onClick={() => toggoleActive('edite')}
              className="absolute top-0 right-0 flex items-center gap-1 text-white bg-purple-600 rounded-md px-3 py-2 hover:bg-purple-700 cursor-pointer font-semibold text-[16px]"
            >
              <RiEdit2Fill /> Edite
            </button>
            <div
              onClick={() => toggoleActive('ImageToggole')}
              className="w-75 h-75 border-[6px] rounded-full border-purple-600 overflow-hidden"
            >
              <img
                className="w-full h-full rounded-full object-cover active:scale-110 ease-in-out transition-all duration-500"
                src="/Image.jpg"
                alt="Image"
              />
            </div>
            <div
              className={`${
                active.ImageToggole ? 'block' : 'hidden'
              } absolute left-37.5 z-20`}
            >
              <div className="relative bg-white text-black p-2 rounded-lg w-44 before:absolute before:-top-2 before:left-6 before:w-0 before:h-0 before:border-l-8 before:border-r-8 before:border-b-8 before:border-l-transparent before:border-r-transparent before:border-b-white ">
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
            <span
              onClick={() => toggoleActive('StoryUpload')}
              className="absolute bottom-0 left-0 w-12.5 h-12.5 bg-purple-600 flex items-center justify-center rounded-full cursor-pointer border border-gray-500"
            >
              <Plus />
            </span>
          </div>
          <div className="flex flex-col items-center justify-between border-b border-gray-400 pb-5 mobile:mt-5 tablet:mt-0 laptop:mt-0">
            <div className="relative mb-3.5">
              <h3 className="uppercase flex items-center gap-3.5 mobile:text-[22px] tablet:text-2xl laptop:text-2xl font-bold font-inter text-white">
                mahammud hassan limon
                <span className="mobile:hidden tablet:flex laptop:flex items-center gap-1 text-sm bg-gray-700 w-30 justify-center h-10 border border-gray-500 rounded-full">
                  Creator
                  <img
                    className=" h-6 object-contain bg-center "
                    src="/verified-account.png"
                    alt="verify"
                  />
                </span>
                <span className="mobile:absolute mobile:-top-9.5 mobile:right-0  tablet:hidden laptop:hidden flex items-center gap-1 text-[12px] bg-gray-700 w-25 justify-center h-8.75 border border-gray-500 rounded-full z-10">
                  Creator
                  <img
                    className=" h-5 object-contain bg-center "
                    src="/verified-account.png"
                    alt="verify"
                  />
                </span>
              </h3>
              <h3 className="text-sm font-normal font-inter text-white mobile:my-4 tablet:mt-3.5 laptop:mt-3.5">
                I'm Full stack Developer || Web Designer || MERN stack Developer
              </h3>
            </div>
            <div className="flex flex-col items-center justify-between">
              <VoiceChatCard
                audioSrc="/Sayfalse  Nulteex - AL NACER!.mp3"
                status="online"
              />
              <button className="flex items-center gap-1 text-md font-inter font-semibold text-white bg-purple-500 w-full  justify-center py-2 rounded-full mt-4 hover:bg-purple-600 cursor-pointer">
                <span>
                  <IoPersonAddSharp />
                </span>
                Add Friend
              </button>
            </div>
          </div>
          <AllFriend />
          <Stories />
          <BlockUser />
          {active.edite && (
            <Edite setActive={setActive} onClose={() => setActive(false)} />
          )}
          {active.StoryUpload && <AddStory onClose={() => setActive(false)} />}
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

export default MobileSetting;
