'use client';

import React, { useState } from 'react';
import { GoHome } from 'react-icons/go';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { LuMessageCircleMore } from 'react-icons/lu';
import { GrLogout } from 'react-icons/gr';
import { FaMoon } from 'react-icons/fa';

const Sideber = ({ setActivePage }) => {
  let [hoveredButton, setHoveredButton] = useState({
    home: false,
    message: false,
    notification: false,
    settings: false,
    logout: false,
  });

  let handleactive = type => {
    setHoveredButton({
      home: false,
      message: false,
      notification: false,
      settings: false,
      logout: false,
    });
    setHoveredButton(prevState => ({
      ...prevState,
      [type]: true,
    }));
  };
  return (
    <>
      <nav
        className="
    fixed top-0 left-0 w-full h-20 
    border-b-2 border-white p-5
    mobile:block tablet:block laptop:block computer:hidden
  "
        style={{
          background: `
      radial-gradient(
        400px at bottom right,
        rgba(147, 51, 234, 0.45),
        transparent 70%
      ),
      #000
    `,
        }}
      >
        <div className="relative">
          <h1 className="text-[25px] font-inter font-medium text-white">
            𝑴𝒊𝒍𝒊 𝒄𝒉𝒂𝒕
          </h1>
        </div>

        <div className="absolute top-5 right-5 bg-purple-600 w-[50px] h-[50px] rounded-full flex items-center justify-center">
          <FaMoon size={24} className="text-white" />
        </div>
      </nav>

      <section className="mobile:hidden tablet:hidden laptop:hidden computer:block computer:max-w-[300px]">
        <div className="flex flex-col gap-3.50 w-[220px] h-auto shadow-2xl border border-white bg-transparent p-5">
          <div className="w-[120px] h-[120px] rounded-full border-2 border-purple-600 mx-auto">
            <img
              className="w-full h-full object-cover bg-cover rounded-full"
              src="/Image.jpg"
              alt=""
            />
          </div>
          <h1 className="w-[188px] text-[20px] font-open_sens text-white leading-6 mt-2.5 text-center mx-auto">
            Mahammud Hassan Limon
          </h1>

          <div className="flex flex-col gap-[50px] my-[35px]">
            <button
              onClick={() => {
                handleactive('home');
                setActivePage('home');
              }}
              className={` text-[40px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.home
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-[135px] h-20 flex items-center justify-center`}
            >
              <GoHome />
            </button>
            <button
              onClick={() => {
                setActivePage('messages');
                handleactive('message');
              }}
              className={` text-[40px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.message
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-[135px] h-20 flex items-center justify-center`}
            >
              <LuMessageCircleMore />
            </button>
            <button
              onClick={() => {
                setActivePage('notification');
                handleactive('notification');
              }}
              className={` text-[40px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.notification
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-[135px] h-20 flex items-center justify-center`}
            >
              <IoMdNotificationsOutline />
            </button>
            <button
              onClick={() => {
                setActivePage('settings');
                handleactive('settings');
              }}
              className={` text-[40px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.settings
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-[135px] h-20 flex items-center justify-center`}
            >
              <IoSettingsOutline />
            </button>
            <button
              onClick={() => {
                setActivePage('settings');
                handleactive('logout');
              }}
              className={` text-[40px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.logout
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-[135px] h-20 flex items-center justify-center`}
            >
              <GrLogout />
            </button>
          </div>
        </div>
      </section>

      <section className="w-full fixed bottom-0 left-0 z-50 mobile:block tablet:block laptop:block computer:hidden">
        <div className="flex items-center gap-3.50 w-full h-auto shadow-2xl border border-white bg-[#0b0b0b] overflow-x-scroll">
          <div className="mobile:hidden tablet:block laptop:block w-[50px] h-[50px] rounded-full border-2 border-purple-600 mx-auto">
            <img
              className="w-full h-full object-cover bg-cover rounded-full"
              src="/Image.jpg"
              alt=""
            />
          </div>
          <div className="flex items-center">
            <button
              onClick={() => {
                handleactive('home');
                setActivePage('home');
              }}
              className={` text-[28px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.home
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-23 h-15 flex items-center justify-center`}
            >
              <GoHome />
            </button>
            <button
              onClick={() => {
                setActivePage('messages');
                handleactive('message');
              }}
              className={` text-[28px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.message
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-23 h-15 flex items-center justify-center`}
            >
              <LuMessageCircleMore />
            </button>
            <button
              onClick={() => {
                setActivePage('notification');
                handleactive('notification');
              }}
              className={` text-[28px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.notification
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-23 h-15 flex items-center justify-center`}
            >
              <IoMdNotificationsOutline />
            </button>
            <button
              onClick={() => {
                setActivePage('settings');
                handleactive('settings');
              }}
              className={` text-[28px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.settings
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-23 h-15 flex items-center justify-center`}
            >
              <IoSettingsOutline />
            </button>
            <button
              onClick={() => {
                setActivePage('settings');
                handleactive('logout');
              }}
              className={` text-[28px] hover:text-purple-600 hover:bg-white transition-all ${
                hoveredButton.logout
                  ? 'bg-white border-r-4 border-purple-600 rounded-r-lg text-purple-600 scale-110'
                  : 'border border-gray-400 scale-100'
              } ease-in-out duration-300 cursor-pointer mx-auto w-23 h-15 flex items-center justify-center`}
            >
              <GrLogout />
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Sideber;
