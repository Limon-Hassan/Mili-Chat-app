'use client';
import React, { useEffect, useState } from 'react';

const Friend_Request = () => {
  const [mobileHeight, setVh] = useState(null);
  useEffect(() => {
    let calculateVh = () => {
      if (window.innerWidth >= 1024) {
        setVh(null);
        return;
      }

      const h = window.innerHeight;

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
    window.addEventListener('resize', calculateVh);
    return () => {
      window.removeEventListener('resize', calculateVh);
    };
  }, []);
  return (
    <>
      <section className="mobile:w-full tablet:w-full laptop:w-full computer:w-[390px] mobile:h-auto tablet:h-auto laptop:h-auto computer:h-[430px] bg-transparent border border-white p-5 rounded-lg mobile:absolute mobile:top-[175px] mobile:left-0 tablet:absolute tablet:top-[185px] tablet:left-0 laptop:absolute laptop:top-[185px] laptop:left-0 computer:relative computer:top-0">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          Friend Requests
        </h1>

        <div className="mt-5">
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
          className="flex flex-col gap-1 mt-5 overflow-auto w-full  computer:max-h-60"
          style={{
            height: mobileHeight ? `${mobileHeight}vh` : 'auto',
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
