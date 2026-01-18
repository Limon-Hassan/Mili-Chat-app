'use client';
import {  X } from 'lucide-react';
import React, { useEffect, useRef } from 'react';

const GroupFriendViewer = ({ setGroupFriendViewer, friends }) => {
  let sectionRef = useRef(null);

  useEffect(() => {
    let handleClickOutside = e => {
      if (!sectionRef.current.contains(e.target)) {
        setGroupFriendViewer(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  return (
    <div
      ref={sectionRef}
      className=" absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-[300px] h-[200px] bg-white rounded-md shadow-lg border border-gray-400 overflow-auto"
    >
      <div className="flex flex-col gap-1 p-2 relative">
        {friends.map(friend => (
          <div
            key={friend.id}
            className="flex items-center gap-3 border border-gray-400 p-3 rounded-md"
          >
            <img
              className="w-10 h-auto rounded-full object-cover bg-center"
              src={friend.avatar || 'defult.png'}
              alt=""
            />
            <h4 className="text-gray-500">{friend.name}</h4>
          </div>
        ))}
      </div>
      <span className=" absolute top-0 right-0 bg-red-500 w-5 h-5 flex items-center justify-center rounded-full text-white cursor-pointer">
        <X onClick={() => setGroupFriendViewer(false)} />
      </span>
    </div>
  );
};

export default GroupFriendViewer;
