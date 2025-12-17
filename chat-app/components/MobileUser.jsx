'use client';
import { UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const MobileUser = () => {
  const [mobileHeight, setVh] = useState(null);

  useEffect(() => {
    let calculateVh = () => {
      if (window.innerWidth >= 1024) {
        setVh(null);
        return;
      }
      const h = window.visualViewport
        ? window.visualViewport.height
        : window.innerHeight;

      const minH = 475;
      const maxH = 800;

      const minVh = 10;
      const maxVh = 45;
      if (h <= minH) {
        setVh(minVh);
        return;
      }

      if (h >= maxH) {
        setVh(maxVh);
        return;
      }
      const ratio = (h - minH) / (maxH - minH);
      const calculatedVh = minVh + ratio * (maxVh - minVh);

      setVh(Number(calculatedVh.toFixed(1)));
    };
    calculateVh();
     window.visualViewport?.addEventListener('resize', calculateVh);
    window.addEventListener('resize', calculateVh);
    return () => {
      window.visualViewport?.removeEventListener('resize', calculateVh);
      window.removeEventListener('resize', calculateVh);
    };
  }, []);

  return (
    <>
      <section
        className={`mobile:w-full tablet:w-full laptop:w-full computer:w-0 h-auto  bg-transparent border border-white p-5 rounded-lg mobile:absolute mobile:top-43.75 mobile:left-0 tablet:absolute tablet:top-46.25 tablet:left-0 laptop:absolute laptop:top-46.25 laptop:left-0 computer:hidden`}
      >
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Add user
        </h1>

        <div className="mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search user..."
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul
          className="flex flex-col gap-1 mt-5 overflow-auto w-full "
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
              <h5 className="text-[14px] h-[22px] font-open_sens font-semibold text-white">
                mahammud hassan limon
              </h5>
            </div>
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>{' '}
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
            <button className="text-[28px] h-10 font-inter font-semibold bg-green-600 px-2.5 rounded-md text-white cursor-pointer hover:opacity-70 ">
              <UserPlus />
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default MobileUser;
