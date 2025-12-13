'use client';
import React, { useState } from 'react';
import Group from './Group';
import Friend_Request from './Friend_Request';
import MyGroup from './MyGroup';
import MobileUser from './MobileUser';

const MobileSideIcons = () => {
  let [active, setActive] = useState('a');

  let handleActive = type => {
    setActive(type);
  };

  return (
    <>
      <div className="relative flex items-center gap-2 mt-[85px] mobile:flex tablet:flex laptop:flex computer:hidden ">
        <button
          onClick={() => handleActive('a')}
          className={`${
            active === 'a' ? 'bg-white text-purple-500' : 'bg-purple-400'
          } text-[16px] font-inter  w-[150px] h-10 rounded-md flex items-center justify-center `}
        >
          User
        </button>
        <button
          onClick={() => handleActive('b')}
          className={`${
            active === 'b' ? 'bg-white text-purple-500' : 'bg-purple-400'
          } text-[16px] font-inter  w-[150px] h-10 rounded-md flex items-center justify-center `}
        >
          Groups
        </button>
        <button
          onClick={() => handleActive('c')}
          className={`${
            active === 'c' ? 'bg-white text-purple-500' : 'bg-purple-400'
          } text-[16px] font-inter  w-[150px] h-10 rounded-md flex items-center justify-center `}
        >
          Friend Requests
        </button>
        <button
          onClick={() => handleActive('d')}
          className={`${
            active === 'd' ? 'bg-white text-purple-500' : 'bg-purple-400'
          } text-[16px] font-inter  w-[150px] h-10 rounded-md flex items-center justify-center `}
        >
          My Groups
        </button>
      </div>
      {active === 'a' && <MobileUser />}
      {active === 'b' && <Group />}
      {active === 'c' && <Friend_Request />}
      {active === 'd' && <MyGroup />}
    </>
  );
};

export default MobileSideIcons;
