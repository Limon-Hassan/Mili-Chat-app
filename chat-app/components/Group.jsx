'use client';
import React, { useEffect, useState } from 'react';
import CreateGroup from './CreateGroup';
import { useGraphQL } from './Hook/useGraphQL';
import GroupFriendViewer from './GroupFriendViewer';
import { useSocket } from './Hook/useSocket';

const Group = () => {
  let { request, loading, error } = useGraphQL();
  let [group, setGroup] = useState(false);
  let [groupData, setGroupData] = useState([]);
  let [groupFriendViewer, setGroupFriendViewer] = useState(false);
  let [selectedGroupFriends, setSelectedGroupFriends] = useState([]);

  useEffect(() => {
    let fetchGroupData = async () => {
      try {
        let query = `
        query Allgroup {
          Allgroup {
            id
            name
            photo
            friendCount
            friends {
              id
              name
              avatar
            }
          }
        }
      `;
        let data = await request(query);

        setGroupData(data.Allgroup);
      } catch (error) {
        console.error('Error fetching group data:', error);
      }
    };
    fetchGroupData();
  }, []);
  let currentUserID = localStorage.getItem('userId');
  useSocket({
    userId: currentUserID,
    onEvents: {
      addedToGroup: data => {
        console.log('group data', data);
      },
    },
  });

  //group request and rejection baki

  return (
    <>
      <section className=" laptop:w-full computer:w-125 laptop:h-auto  bg-transparent border border-white  laptop:p-5 computer:p-4 rounded-lg  laptop:absolute laptop:top-46.25 laptop:left-0 computer:relative computer:top-0 relative ">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Groups
        </h1>

        <div className=" laptop:mt-5 computer:mt-5 flex items-center justify-between">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search Group"
            />
          </div>
          <button
            onClick={() => setGroup(!group)}
            className="text-sm font-inter font-bold bg-green-400 px-5 py-2.5 rounded-full text-white cursor-pointer hover:opacity-70"
          >
            Create
          </button>
          {group && <CreateGroup setGroup={setGroup} />}
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full  computer:h-66.25">
          {groupData.length === 0 && (
            <p className="text-white text-[15px] font-open_sens font-semibold text-center flex items-center justify-center w-full h-screen">
              No Groups Found
            </p>
          )}
          {groupData.map((group, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-15 h-15 object-cover bg-center rounded-full"
                  src={group.photo || 'defult.png'}
                  alt="group"
                />
                <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white flex flex-col gap-1">
                  {group.name}
                  <p
                    onClick={() => {
                      setSelectedGroupFriends(group.friends);
                      setGroupFriendViewer(true);
                    }}
                    className="text-sm font-light text-gray-400"
                  >
                    {group.friendCount > 0 &&
                      `Your ${group.friendCount} friends has joined this group `}
                  </p>
                </h5>
              </div>
              <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-1.25 rounded-full h-7.5 text-white cursor-pointer hover:opacity-70">
                Join
              </button>
            </li>
          ))}
          {groupFriendViewer && (
            <GroupFriendViewer
              setGroupFriendViewer={setGroupFriendViewer}
              friends={selectedGroupFriends}
            />
          )}
        </ul>
      </section>
    </>
  );
};

export default Group;
