'use client';
import React, { useState } from 'react';
import CreateGroup from './CreateGroup';

const Group = () => {
  let [group, setGroup] = useState(false);

  return (
    <>
      <section className=" laptop:w-full computer:w-125 laptop:h-auto  bg-transparent border border-white  laptop:p-5 computer:p-4 rounded-lg  laptop:absolute laptop:top-46.25 laptop:left-0 computer:relative computer:top-0">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Group
        </h1>

        <div className=" laptop:mt-5 computer:mt-5 flex items-center justify-between">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search Group"
            />
          </div>
          <button
            onClick={() => setGroup(!group)}
            className="text-sm font-inter font-bold bg-green-400 px-5 py-2.5 rounded-full text-white cursor-pointer hover:opacity-70"
          >
            Create
          </button>
          {group && <CreateGroup setGroup={setGroup} />}
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full  computer:max-h-66.25">
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
