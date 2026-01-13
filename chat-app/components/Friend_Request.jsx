'use client';
import { useDynamicHeight } from '@/customHook/useDynamicHeight';
import React from 'react';

const Friend_Request = () => {
  let dynamic = useDynamicHeight({
    baseHeight: 555,
    basePx: 180,
    maxPx: 430,
    computerHeight: 265,
  });
  return (
    <>
      <section className="mobile:w-full tablet:w-full laptop:w-full computer:w-97.5 tablet:h-auto laptop:h-auto computer:h-107.5 bg-transparent border border-white mobile:p-4 tablet:p-5 laptop:p-5 computer:p-4 rounded-lg mobile:absolute mobile:top-38.75 mobile:left-0 tablet:absolute tablet:top-46.25 tablet:left-0 laptop:absolute laptop:top-46.25 laptop:left-0 computer:relative computer:top-0">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Friend Requests
        </h1>

        <div className="mobile:mt-2.5 tablet:mt-5 laptop:mt-5 computer:mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search Requests"
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul
          className="flex flex-col gap-1 mt-5 overflow-auto w-full   computer:max-h-66.25 transition-all ease-in-out duration-400"
          style={{ maxHeight: `${dynamic}px` }}
        >
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[12px] font-inter font-bold bg-purple-500 px-3.5 py-[5px] h-[30px] rounded-full text-white cursor-pointer hover:opacity-70 ">
              Accept
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Friend_Request;
