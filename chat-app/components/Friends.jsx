'use client';
import React, { useEffect, useState } from 'react';
import { LuMessageCircleMore } from 'react-icons/lu';
import { useGraphQL } from './Hook/useGraphQL';
import { useSocket } from './Hook/useSocket';

const Friends = () => {
  let { request, loading, error } = useGraphQL();
  let [friends, setFriends] = useState([]);

  let FetchMe = async () => {
    try {
      const query = `query {me {friends { id name avatar }}}`;
      const data = await request(query);
      setFriends(data.me.friends);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    FetchMe();
  }, []);
  let currentUserID = localStorage.getItem('userId');
  useSocket({
    userId: currentUserID,
    onEvents: {
      friendRequestAccepted: data => {
        if (currentUserID === data.fromUser.id) {
          setFriends(prev => [...prev, data.toUser]);
        } else if (currentUserID === data.toUser.id) {
          setFriends(prev => [...prev, data.fromUser]);
        }
      },

      friendRemoved: data => {
        if (currentUserID === data.actorId) {
          setFriends(prev => prev.filter(f => f.id !== data.targetId));
          FetchMe();
        } else {
          setFriends(prev => prev.filter(f => f.id !== data.actorId));
          FetchMe();
        }
      },

      userBlocked: data => {
        if (currentUserID === data.byUserId) {
          setFriends(prev => prev.filter(f => f.id !== data.blockedUserId));
        } else {
          setFriends(prev => prev.filter(f => f.id !== data.byUserId));
        }
      },
    },
  });

  return (
    <>
      <section className="laptop:w-full computer:w-125 laptop:h-auto bg-transparent border border-white p-4 rounded-lg laptop:absolute laptop:top-27.5 laptop:left-0 computer:relative computer:top-0">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Friends
        </h1>

        <div className="mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search Friends"
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full computer:h-66.25">
          {friends.length === 0 && (
            <p className="text-white text-[15px] font-open_sens font-semibold text-center flex items-center justify-center w-full h-screen">
              No Friends Found
            </p>
          )}
          {friends.map(friend => (
            <li
              key={friend.id}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-15 h-15 object-cover bg-center rounded-full"
                  src={friend.avatar || 'defult.png'}
                  alt="group"
                />
                <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                  {friend.name}
                </h5>
              </div>
              <button
                type="button"
                className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
              >
                <LuMessageCircleMore />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Friends;
