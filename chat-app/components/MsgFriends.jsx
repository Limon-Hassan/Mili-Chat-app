'use client';
import React, { useEffect, useState } from 'react';
import { LuMessageCircleMore } from 'react-icons/lu';
import { useGraphQL } from './Hook/useGraphQL';

const MsgFriends = () => {
  let { request, loading, error } = useGraphQL();
  let [friends, setFriends] = useState([]);
  let [groups, setGroups] = useState([]);

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
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full h-180">
          {friends.map((frn, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-15 h-15 object-cover bg-center rounded-full"
                  src={frn.avatar || 'defult.png'}
                  alt="group"
                />
                <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                  {frn.name}
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

export default MsgFriends;
