'use client';
import React, { useState } from 'react';
import MobileUser from './Mobile/MobileUser';
import MobileFriend_Req from './Mobile/MobileFriend_Req';
import Mobile_Groups from './Mobile/Mobile_Groups';

const MobileSideIcons = () => {
  let [active, setActive] = useState('a');

  let handleActive = type => {
    setActive(type);
  };

  return (
    <>
      <div className="relative flex items-center gap-2 mt-17.5 mobile:flex tablet:flex laptop:flex computer:hidden ">
        <button
          onClick={() => handleActive('a')}
          className={`${
            active === 'a' ? 'bg-white text-purple-500' : 'bg-purple-400'
          } text-[16px] font-inter  w-37.5 h-10 rounded-md flex items-center justify-center `}
        >
          User
        </button>
        <button
          onClick={() => handleActive('b')}
          className={`${
            active === 'b' ? 'bg-white text-purple-500' : 'bg-purple-400'
          } text-[16px] font-inter  w-37.5 h-10 rounded-md flex items-center justify-center `}
        >
          Groups
        </button>
        <button
          onClick={() => handleActive('c')}
          className={`${
            active === 'c' ? 'bg-white text-purple-500' : 'bg-purple-400'
          } text-[16px] font-inter  w-37.5 h-10 rounded-md flex items-center justify-center `}
        >
          Friend Requests
        </button>
      </div>
      {active === 'a' && <MobileUser />}
      {active === 'b' && <Mobile_Groups />}
      {active === 'c' && <MobileFriend_Req />}
    </>
  );
};

export default MobileSideIcons;
