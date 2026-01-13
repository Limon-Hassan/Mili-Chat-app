'use client';
import { UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useGraphQL } from './Hook/useGraphQL';
import { FaUserClock } from 'react-icons/fa';

const AddUser = () => {
  let { request, loading, error } = useGraphQL();
  let [users, setUsers] = useState([]);
  let [pendingRequests, setPendingRequests] = useState({});

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
        [frdId]: data.sendFriendRequest.status,
      }));
      console.log(data);
    } catch (error) {
      console.log(error);
      console.error(error);
    }
  };
  return (
    <>
      <section
        className={`w-100 h-auto bg-transparent border border-white p-5 rounded-lg `}
      >
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Add user
        </h1>

        <div className="mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search user..."
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full max-h-80">
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
              <button
                onClick={() => handleSendFriendREQ(u.id)}
                className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 "
              >
                {pendingRequests[u.id] === 'pending' ? (
                  <FaUserClock />
                ) : (
                  <UserPlus />
                )}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default AddUser;
