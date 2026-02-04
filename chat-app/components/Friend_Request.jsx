'use client';
import React, { useEffect, useState } from 'react';
import { useGraphQL } from './Hook/useGraphQL';
import { useSocket } from './Hook/useSocket';

const Friend_Request = () => {
  let { request, loading, error } = useGraphQL();
  let [requests, setRequests] = useState([]);
  let [activeRequestId, setActiveRequestId] = useState(null);

  let FetchRequest = async () => {
    try {
      const query = `
          query {
            friendRequests {
              id
              status
              from {
                id
                name
                email
                avatar
              }
            }
          }
        `;

      let data = await request(query);
      setRequests(data.friendRequests);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    FetchRequest();
  }, []);

  const handleAccept = async reqId => {
    try {
      const ACCEPT_MUTATION = `
     mutation AcceptFriendRequest($requestId: ID!) {
      acceptFriendRequest(requestId: $requestId)
    }`;

      let data = await request(ACCEPT_MUTATION, { requestId: reqId });
      if (data.acceptFriendRequest) {
        setRequests(prev => prev.filter(r => r.id !== reqId));
        setActiveRequestId(null);
        FetchRequest();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async reqId => {
    try {
      const REJECT_MUTATION = `mutation RejectFriendRequest($requestId: ID!) {requestRejected(requestId: $requestId)}`;

      let data = await request(REJECT_MUTATION, { requestId: reqId });
      if (data.acceptFriendRequest) {
        setRequests(prev => prev.filter(r => r.id !== reqId));
        setActiveRequestId(null);
        FetchRequest();
      }
    } catch (error) {
      console.log(error);
    }
    setActiveRequestId(null);
  };

  useSocket({
    userId: localStorage.getItem('userId'),
    onEvents: {
      friendRequestReceived: data => {
        setRequests(prev => [
          {
            id: data.requestId,
            status: 'pending',
            from: data.fromUser,
          },
          ...prev,
        ]);
      },

      friendRequestAccepted: data => {
        setRequests(prev => prev.filter(r => r.id !== data.requestId));
        FetchRequest();
      },

      friendRequestRejected: data => {
        setRequests(prev => prev.filter(r => r.id !== data.requestId));
        FetchRequest();
      },
    },
  });

  return (
    <>
      <section className=" laptop:w-full computer:w-125 laptop:h-auto computer:h-107.5 bg-transparent border border-white laptop:p-5 computer:p-4 rounded-lg laptop:absolute laptop:top-46.25 laptop:left-0 computer:relative computer:top-0">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Friend Requests
        </h1>

        <div className=" laptop:mt-5 computer:mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search Requests"
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul className="relative flex flex-col gap-1 mt-5 overflow-auto w-full   computer:h-66.25 laptop:h-66.25">
          {requests.length === 0 && (
            <p className="text-white text-[15px] font-open_sens font-semibold text-center flex items-center justify-center w-full h-screen">
              No Requests Found
            </p>
          )}
          {requests.map(req => (
            <li
              key={req.id}
              className="relative flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-15 h-15 object-cover bg-center rounded-full"
                  src={req.from?.avatar || 'defult.png'}
                  alt="group"
                />
                <h5 className="text-[14px] h-5.5 font-open_sens font-semibold text-white">
                  {req.from?.name}
                </h5>
              </div>
              {activeRequestId === req.id ? (
                <div className="flex flex-col">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-1.25 h-7.5 rounded-t-md text-white cursor-pointer hover:opacity-70 "
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="text-[12px] font-inter font-bold bg-red-400 px-3.5 py-1.25 h-7.5 rounded-b-md text-white cursor-pointer hover:opacity-70 "
                  >
                    Reject
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setActiveRequestId(req.id)}
                  className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-1.25 h-7.5 rounded-full text-white cursor-pointer hover:opacity-70 "
                >
                  Accept
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Friend_Request;
