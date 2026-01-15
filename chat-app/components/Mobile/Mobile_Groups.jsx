'use client';
import React from 'react';
import { useDynamicHeight } from '@/customHook/useDynamicHeight';

const Mobile_Groups = () => {
  let dynamic = useDynamicHeight({
    baseHeight: 555,
    basePx: 180,
    maxPx: 430,
  });

  return (
    <>
      <section className="mobile:w-full tablet:w-full tablet:h-auto   bg-transparent border border-white mobile:p-4 tablet:p-5 rounded-lg mobile:absolute mobile:top-38.75 mobile:left-0 tablet:absolute tablet:top-46.25 tablet:left-0 ">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Group
        </h1>

        <div className="mobile:mt-2.5 tablet:mt-5 flex items-center justify-between">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search Group"
            />
          </div>
          <button className="text-sm font-inter font-bold bg-green-400 px-5 py-2.5 rounded-full text-white cursor-pointer hover:opacity-70">
            Create
          </button>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul
          className="flex flex-col gap-1 mt-5 overflow-auto w-full  computer:max-h-66.25 transition-all ease-in-out duration-400"
          style={{ maxHeight: `${dynamic}px` }}
        >
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-15 h-15 object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-1.25 rounded-full h-7.5 text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[15px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-sm font-inter font-bold bg-purple-500 px-3.5 py-[5px] rounded-full h-[30px] text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Mobile_Groups;
