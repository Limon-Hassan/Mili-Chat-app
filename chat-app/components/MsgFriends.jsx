'use client';
import React, { useState } from 'react';
import { LuMessageCircleMore } from 'react-icons/lu';
import { useGraphQL } from './Hook/useGraphQL';

const MsgFriends = () => {
  let { request, loading, error } = useGraphQL();
  let [friends, setFriends] = useState([]);

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
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-5.5 font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button
              type="button"
              className="text-[20px] h-7.5 font-inter font-bold bg-purple-500 px-5 py-1.25 rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default MsgFriends;
