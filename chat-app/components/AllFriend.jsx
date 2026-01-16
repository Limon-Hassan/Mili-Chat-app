'use client';
import React, { useEffect, useState } from 'react';
import { useGraphQL } from './Hook/useGraphQL';

const AllFriend = () => {
  let { request, loading, error } = useGraphQL();
  let [friends, setFriends] = useState([]);

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

  return (
    <>
      <section>
        <div>
          <h2 className="text-2xl flex items-center justify-between font-bold font-inter text-white mb-5">
            Friends
            <span className="text-[16px] font-inter font-semibold cursor-pointer underline active:text-blue-500">
              see all
            </span>
          </h2>
          <div className="grid mobile:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 computer:grid-cols-6 items-center gap-2.5 border border-gray-400 mobile:p-2 tablet:p-3 laptop:p-5 computer:p-5 rounded-lg">
            {friends.map(friend => (
              <div key={friend.id} className="flex flex-col items-center justify-center mobile:p-1  tablet:p-2.5 laptop:p-2.5 computer:p-2.5 border border-gray-300 rounded-lg mx-auto">
                <img
                  className="w-25 h-25 object-cover rounded-md"
                  src={friend.avatar || 'defult.png'}
                  alt="User"
                />
                <h4 className="text-sm text-center mx-auto font-inter font-medium mt-2">
                  {friend.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AllFriend;
