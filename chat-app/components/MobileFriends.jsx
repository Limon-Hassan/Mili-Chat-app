'use client';
import React from 'react';
import { LuMessageCircleMore } from 'react-icons/lu';
import useMobileHeight from './Hook/useMobileHeight';

const MobileFriends = () => {
  let handleMessage = () => {
    window.location.href = '/message';
  };
  let mobileHeight = useMobileHeight();

  return (
    <>
      <section className="mobile:w-full tablet:w-full laptop:w-full computer:w-[390px] mobile:h-auto tablet:h-auto laptop:h-auto bg-transparent border border-white p-2 rounded-lg mobile:absolute mobile:top-[110px] mobile:left-0 tablet:absolute tablet:top-[110px] tablet:left-0 laptop:absolute laptop:top-[110px] laptop:left-0 ">
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
        <ul
          className="flex flex-col gap-1 mt-5 overflow-auto w-full"
          style={{
            height: mobileHeight ? `${mobileHeight}vh` : '100dvh',
          }}
        >
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>{' '}
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className="flex items-center gap-2.5">
              <img
                className="w-[60px] h-[60px] object-cover bg-center rounded-full"
                src="/Image.jpg"
                alt="group"
              />
              <h5
                onClick={handleMessage}
                className="text-[15px] h-[22px] font-open_sens font-semibold text-white"
              >
                mahammud hassan limon
              </h5>
            </div>
            <button
              onClick={handleMessage}
              type="button"
              className="text-[20px] h-[30px] font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70"
            >
              <LuMessageCircleMore />
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default MobileFriends;
