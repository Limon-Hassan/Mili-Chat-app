'use client';
import React, { useEffect, useState } from 'react';

const Group = () => {

  return (
    <>
      <section className="mobile:w-full tablet:w-full laptop:w-full computer:w-[390px] mobile:h-auto tablet:h-auto laptop:h-auto computer:h-[430px] bg-transparent border border-white p-5 rounded-lg mobile:absolute mobile:top-[175px] mobile:left-0 tablet:absolute tablet:top-[185px] tablet:left-0 laptop:absolute laptop:top-[185px] laptop:left-0 computer:relative computer:top-0">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Group
        </h1>

        <div className="mt-5 flex items-center justify-between">
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
          className="flex flex-col gap-1 mt-5 overflow-auto w-full mobile:max-h-[44dvh] mobile:min-h-[30dvh] computer:max-h-60"
       
        >
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

export default Group;
