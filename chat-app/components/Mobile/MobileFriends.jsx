'use client';
import { useDynamicHeight } from '@/customHook/useDynamicHeight';
import React, { useEffect, useState } from 'react';
import { LuMessageCircleMore } from 'react-icons/lu';
import { useGraphQL } from '../Hook/useGraphQL';

const MobileFriends = () => {
  let { request, loading, error } = useGraphQL();
  let [friends, setFriends] = useState([]);
  let [groups, setGroups] = useState([]);

  let dynamic = useDynamicHeight({
    baseHeight: 555,
    basePx: 230,
    maxPx: 480,
  });

  let handleMessage = () => {
    window.location.href = '/message';
  };

  useEffect(() => {
    let FetchMe = async () => {
      try {
        const query = `query {me {friends { id name avatar }}}`;
        const data = await request(query);
        setFriends(data.me.friends);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMe();
  }, []);

  useEffect(() => {
     let FetchMyGroup = async () => {
       try {
         const query = `
   query MyGroups {
     myGroups {
       id
       name
       photo
       createdAt
       Admin {
         id
         name
         avatar
       }
       members {
         id
         name
         avatar
       }
     }
   }
 `;
         const data = await request(query);
         setGroups(data.myGroups);
       } catch (error) {
         console.log(error);
       }
     };
 
     FetchMyGroup();
   }, []);

  return (
    <>
      <section className="mobile:w-full tablet:w-full mobile:h-auto tablet:h-auto bg-transparent border border-white p-3 rounded-lg mobile:absolute mobile:top-25 mobile:left-0 tablet:absolute tablet:top-27.5 tablet:left-0">
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

        <ul
          className="flex flex-col gap-1 mt-5 overflow-auto w-full"
          style={{ maxHeight: `${dynamic}px` }}
        >
          {friends.map((frn, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-15 h-15 object-cover bg-center rounded-full"
                  src={frn.avatar || '/defult.png'}
                  alt="group"
                />
                <h5
                  onClick={handleMessage}
                  className="text-[15px] h-5.5 font-open_sens font-semibold text-white"
                >
                  {frn.name}
                </h5>
              </div>
              <button
                onClick={handleMessage}
                type="button"
                className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
              >
                <LuMessageCircleMore />
              </button>
            </li>
          ))}

          {groups.map((grp, idx) => (
            <li key={idx} className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
              <div className="flex items-center gap-2.5">
                <div className="relative w-20 h-20 flex items-center justify-center">
                  <img
                  src={grp.photo || 'defult.png'}
                    className="w-15 h-15 rounded-full object-cover z-10"
                    alt="group"
                  />

                  {grp.members.slice(0, 8).map((member, index) => {
                    const radius = 34;
                    const total = Math.min(grp.members.length, 8);
                    const startAngle = -90;

                    const angle =
                      ((startAngle + (index * 360) / total) * Math.PI) / 180;

                    const x = Math.cos(angle) * radius;
                    const y = Math.sin(angle) * radius;

                    return (
                      <img
                        key={member.id}
                        src={member.avatar || '/defult.png'}
                        className="w-5 h-5 rounded-full object-cover absolute z-50"
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                        alt="member"
                      />
                    );
                  })}
                </div>

                <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                  {grp.name}
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

export default MobileFriends;
