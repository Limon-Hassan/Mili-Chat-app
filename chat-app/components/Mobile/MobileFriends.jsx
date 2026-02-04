'use client';
import { useDynamicHeight } from '@/customHook/useDynamicHeight';
import React, { useEffect, useState } from 'react';
import { LuMessageCircleMore } from 'react-icons/lu';
import { useGraphQL } from '../Hook/useGraphQL';
import { useSocket } from '../Hook/useSocket';

const MobileFriends = () => {
  let { request, loading, error } = useGraphQL();
  let [friends, setFriends] = useState([]);
  let [groups, setGroups] = useState([]);
  const [conversation, setConversation] = useState([]);

  let dynamic = useDynamicHeight({
    baseHeight: 555,
    basePx: 230,
    maxPx: 480,
  });

  let handleMessage = item => {
    const convId = item.conversationId;

    const params = new URLSearchParams({
      userId: item.id,
      name: item.name,
      avatar: item.avatar || item.photo || '',
      conversationId: convId || '',
    });

    window.location.href = '/message?' + params.toString();
  };

  useEffect(() => {
    let fetchConversations = async () => {
      try {
        const query = `
    query GetConversations {
      getConversation {
        id
        isGroup
        group        
        lastMessage
        lastMessageType
        lastMessageAt
        participants { 
          id
          name
          avatar
        }
        otherUser { 
          id
          name
          avatar
        }
      }
    }
  `;

        let data = await request(query);
        setConversation(data.getConversation);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    let FetchMe = async () => {
      try {
        const query = `query {me {friends { id name avatar }}}`;
        const data = await request(query);
        let mergedFriends = data.me.friends.map(frd => {
          let conv = conversation.find(
            c => !c.isGroup && c.otherUser?.id === frd.id,
          );

          return {
            ...frd,
            conversationId: conv?.id || null,
          };
        });
        setFriends(mergedFriends);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMe();
  }, [conversation]);

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
        let mergedGroups = data.myGroups.map(grp => {
          let conv = conversation.find(c => c.isGroup && c.group === grp.id);

          return {
            ...grp,
            conversationId: conv?.id || null,
          };
        });
        setGroups(mergedGroups);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMyGroup();
  }, [conversation]);

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
          {friends.length === 0 && (
            <p className="text-white text-[15px] font-open_sens font-semibold text-center flex items-center justify-center w-full h-screen">
              No friends found
            </p>
          )}
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
                  onClick={() => handleMessage(frn)}
                  className="text-[15px] h-5.5 font-open_sens font-semibold text-white"
                >
                  {frn.name}
                </h5>
              </div>
              <button
                onClick={() => handleMessage(frn)}
                type="button"
                className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
              >
                <LuMessageCircleMore />
              </button>
            </li>
          ))}

          {groups.map((grp, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
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
                onClick={() => handleMessage(grp)}
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
