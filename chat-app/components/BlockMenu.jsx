'use client';
import { X } from 'lucide-react';
import React from 'react';
import { useGraphQL } from './Hook/useGraphQL';

const BlockMenu = ({ setBlockMenu, userId, isBlocked, onBlock, onUnblock }) => {
  const { request } = useGraphQL();

  let handleMsgBlock = async () => {
    try {
      let mutation = `mutation MsgblockUser($blockedUserId: ID!) {
    MsgblockUser(blockedUserId: $blockedUserId) {
      id
      name
      WhichBlockedByMe {
        id
        name
        avatar
      }
    }
  }`;
      let data = await request(mutation, { blockedUserId: userId });
      setBlockMenu(false);
    } catch (error) {
      console.log(error);
    }
  };

  let handleBlock = async () => {
    if (!userId) return;
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
      const data = await request(query, { blockerId: userId });
      setBlockMenu(false);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  let handleMsgUnblock = async () => {
    try {
      let mutation = `
      mutation MsgUnBlock($blockedUserId: ID!) {
        MsgUnBlock(blockedUserId: $blockedUserId) {
          id
        }
      }
    `;
      await request(mutation, { blockedUserId: userId });
      onUnblock();
      setBlockMenu(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="absolute top-1/2 translate-y-[-50%] left-1/2 translate-x-[-50%] w-full h-full bg-black/50 flex items-center justify-center">
        <div className=" relative mobile:w-70 tablet:w-80 laptop:w-80 computer:w-80 h-auto bg-white flex flex-col items-center justify-center gap-2 p-2 rounded-md ring-5 ring-gray-400">
          <button className=" absolute -top-3 cursor-pointer -right-2 bg-red-300 rounded-full">
            <X size={24} onClick={() => setBlockMenu(false)} />
          </button>
          <h3 className="flex flex-col gap-1 text-black border border-gray-300 p-2">
            {!isBlocked ? (
              <button
                onClick={async () => {
                  await handleMsgBlock();
                  onBlock();
                }}
                className="text-[14px] font-inter font-medium text-white bg-purple-500 rounded-md py-2 cursor-pointer mb-2"
              >
                Message Block
              </button>
            ) : (
              <button
                onClick={handleMsgUnblock}
                className="text-[14px] font-inter font-medium text-white bg-green-500 rounded-md py-2 cursor-pointer mb-2"
              >
                Unblock
              </button>
            )}

            <span className="text-sm font-normal font-inter">
              This user can't send you any messages but you still have friends
              with them. They just see that you're flying. 🕊️
            </span>
          </h3>
          <h3 className="flex flex-col gap-1 text-black border border-gray-300 p-2">
            <button
              onClick={handleBlock}
              className="text-[14px] font-inter font-medium text-white bg-purple-500 rounded-md py-2 cursor-pointer mb-2"
            >
              Permanent Block
            </button>
            <span className="text-sm font-normal font-inter">
              This user will no longer your friend and they can't see your
              profile and any of your activities. They can't make any
              compromises with you until you gives them any chance.
            </span>
          </h3>
        </div>
      </div>
    </>
  );
};

export default BlockMenu;
