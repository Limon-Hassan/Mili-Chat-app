'use client';
import React, { useEffect, useState } from 'react';
import { useGraphQL } from './Hook/useGraphQL';

const BlockUser = () => {
  let { request, loading, error } = useGraphQL();
  let [blockUser, setBlockUser] = useState([]);

  useEffect(() => {
    let FetchMe = async () => {
      try {
        const query = `query {me {blockedByMe { id name avatar }}}`;
        const data = await request(query);
        setBlockUser(data.me.blockedByMe);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMe();
  }, []);

 
  return (
    <>
      <section className="mobile:w-full tablet:w-full laptop:w-full computer:w-125 mobile:h-auto tablet:h-auto laptop:h-auto bg-transparent border border-white p-4 rounded-lg">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Block users
        </h1>

        <div className="mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search BlockUser"
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full mobile:max-h-80 tablet:max-h-80 laptop:max-h-80 computer:max-h-60">
          {blockUser.length === 0 && (
            <p className="text-white text-[15px] font-open_sens font-semibold text-center flex items-center justify-center w-full h-screen">
              No Blocked User Found
            </p>
          )}
          {blockUser.map(user => (
            <li
              key={user.id}
              className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2"
            >
              <div className="flex items-center gap-2.5">
                <img
                  className="w-12.5 h-12.5 object-cover bg-center rounded-full"
                  src={user.avatar || 'defult.png'}
                  alt="group"
                />
                <h5 className="text-[14px] h-5.5 font-open_sens font-semibold text-white">
                  {user.name}
                </h5>
              </div>
              <button className="text-[12px] h-8.75 flex items-center font-inter font-bold bg-purple-500 w-28.75 rounded-full text-white cursor-pointer hover:opacity-70 justify-center">
                <span className="text-[16px] text-amber-300">😁</span>
                Unblock
              </button>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default BlockUser;
