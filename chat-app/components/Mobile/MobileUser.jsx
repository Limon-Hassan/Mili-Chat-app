'use client';
import { useDynamicHeight } from '@/customHook/useDynamicHeight';
import { UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGraphQL } from '../Hook/useGraphQL';
import { FaUserClock, FaUserFriends } from 'react-icons/fa';

const MobileUser = () => {
  let { request, loading, error } = useGraphQL();
  let [users, setUsers] = useState([]);
  let [pendingMsgs, setPendingMsgs] = useState('');
  let [pendingRequests, setPendingRequests] = useState({});
  let [receivedRequests, setReceivedRequests] = useState({});
  let [friendsMap, setFriendsMap] = useState({});
  let [openFriendAction, setOpenFriendAction] = useState(null);

  const dynamic = useDynamicHeight({
    baseHeight: 555,
    basePx: 180,
    maxPx: 430,
  });

  useEffect(() => {
    let userFetch = async () => {
      try {
        const query = `query {
          users {
            id
            name
            email
          }
        }`;
        let data = await request(query);
        setUsers(data.users);
      } catch (error) {
        console.log(error.message);
        console.error(error);
      }
    };

    userFetch();
  }, []);

  useEffect(() => {
    const fetchPendingSent = async () => {
      try {
        const query = `
          query {
            sentFriendRequests {
              to { id }
              status
            }
          }
        `;

        const data = await request(query);
        const pendingMap = {};
        data.sentFriendRequests.forEach(req => {
          if (req.status === 'pending') {
            pendingMap[req.to.id] = true;
          }
        });

        setPendingRequests(pendingMap);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPendingSent();
  }, []);

  useEffect(() => {
    let FetchReceive = async () => {
      try {
        const query = `
          query {
            friendRequests {
              from { id }
              status
            }
          }
        `;

        const data = await request(query);

        const receivedMap = {};
        data.friendRequests.forEach(req => {
          if (req.status === 'pending') {
            receivedMap[req.from.id] = true;
          }
        });

        setReceivedRequests(receivedMap);
      } catch (error) {
        console.log(error);
      }
    };

    FetchReceive();
  }, []);

  useEffect(() => {
    let FetchMe = async () => {
      try {
        const query = `query {me {friends { id }}}`;

        const data = await request(query);
        const fMap = {};

        data.me.friends.forEach(f => {
          fMap[f.id] = true;
        });

        setFriendReq(fMap);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMe();
  }, []);

  let handleSendFriendREQ = async frdId => {
    const query = `
        mutation SendFriendRequest($toUserId: ID!) {
          sendFriendRequest(toUserId: $toUserId) {
            id
            status
            from { id name email avatar }
            to { id name email avatar }
          }
        }
      `;

    try {
      let data = await request(query, { toUserId: frdId });

      setPendingRequests(prev => ({
        ...prev,
        [frdId]: true,
      }));
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };

  let handlependingMsg = () => {
    setPendingMsgs("Can't send again until accepted");
    setTimeout(() => {
      setPendingMsgs('');
    }, 3000);
  };

  let handleUnfriend = async uid => {
    try {
      const query = `mutation Unfriend($friendId: ID!) {
      unfriend(friendId: $friendId)}`;

      let data = await request(query, { friendId: uid });
      setFriendsMap(prev => ({ ...prev, [uid]: false }));
      setOpenFriendAction(null);
      userFetch();
    } catch (error) {
      console.log(error);
    }
  };

  let handleBlock = async uid => {
    try {
      const query = `
    mutation BlockUser($blockerId: ID!) {
      blockUser(blockerId: $blockerId) {
         id
         name
           blockedByMe {
      id
      name
      avatar
    }
      }
    }
  `;

      let data = await request(query, { blockerId: uid });
      console.log(data);
      setOpenFriendAction(null);
      setFriendsMap(prev => ({ ...prev, [uid]: false }));
      userFetch();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <section
        className={`mobile:w-full tablet:w-full laptop:w-full computer:w-0 bg-transparent border border-white mobile:p-4 tablet:p-5 laptop:p-5 rounded-lg mobile:absolute mobile:top-38.75 mobile:left-0 tablet:absolute tablet:top-46.25 tablet:left-0 laptop:absolute laptop:top-46.25 laptop:left-0 computer:hidden`}
      >
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Add user
        </h1>

        <div className="mobile:mt-2.5 tablet:mt-5 laptop:mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search user..."
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul
          className={`flex flex-col gap-1 mt-5 overflow-auto w-full scrollbar-hide transition-all ease-in-out duration-400 `}
          style={{ maxHeight: `${dynamic}px` }}
        >
          {users.map((u, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-15 h-15 object-cover bg-center rounded-full"
                  src={u.avatar || 'defult.png'}
                  alt="group"
                />
                <h5 className="text-[14px] h-5.5 font-open_sens font-semibold text-white">
                  {u.name}
                </h5>
              </div>
              {openFriendAction === u.id ? (
                <div className="flex flex-col">
                  <button
                    onClick={() => handleUnfriend(u.id)}
                    className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-1.25 h-7.5 rounded-t-md text-white cursor-pointer hover:opacity-70 "
                  >
                    Unfriend
                  </button>
                  <button
                    onClick={() => handleBlock(u.id)}
                    className="text-[12px] font-inter font-bold bg-red-400 px-3.5 py-1.25 h-7.5 rounded-b-md text-white cursor-pointer hover:opacity-70 "
                  >
                    Block
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (friendsMap[u.id]) {
                      setOpenFriendAction(prev =>
                        prev === u.id ? null : u.id
                      );
                      return;
                    }
                    if (pendingRequests[u.id] || receivedRequests[u.id]) {
                      handlependingMsg();
                    } else {
                      handleSendFriendREQ(u.id);
                    }
                  }}
                  className={`text-[28px] h-10 font-inter font-semibold ${
                    friendsMap[u.id]
                      ? 'bg-blue-600'
                      : pendingRequests[u.id] || receivedRequests[u.id]
                      ? 'bg-red-300'
                      : 'bg-green-600'
                  } px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 `}
                >
                  {friendsMap[u.id] ? (
                    <FaUserFriends />
                  ) : pendingRequests[u.id] || receivedRequests[u.id] ? (
                    <FaUserClock />
                  ) : (
                    <UserPlus />
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
      {pendingMsgs && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-black/80 text-white w-55 h-10 rounded-full flex items-center justify-center text-sm z-9999">
          {pendingMsgs}
        </div>
      )}
    </>
  );
};

export default MobileUser;
