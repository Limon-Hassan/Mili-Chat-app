import React from 'react';

const BlockUser = () => {
  return (
    <>
      <section className="w-full min-w-[390px] h-[430px] bg-transparent border border-white p-5 rounded-lg">
        <h1 className="text-[25px] font-open_sens font-semibold text-white">
          BlockUser
        </h1>

        <div className="mt-5">
          <div className=" w-full h-10 bg-white rounded-full mr-1.5">
            <input
              className="w-full h-full bg-transparent outline-none px-3 text-black"
              type="text"
              placeholder="Search BlockUser"
            />
          </div>
        </div>
        <div className="bg-white h-px w-full my-3"></div>
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full max-h-80">
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
            <button className="text-[14px] h-10 flex items-center font-inter font-bold bg-purple-500 px-2.5 rounded-full text-white cursor-pointer hover:opacity-70">
              <span className="text-[18px]">😁</span> Unblock
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default BlockUser;
