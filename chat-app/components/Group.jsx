import React from 'react';

const Group = () => {
  return (
    <>
      <section className="w-[400px] h-[500px] bg-transparent border border-white p-5 rounded-lg">
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
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full max-h-80">
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <img
              className="w-[60px] h-[60px] object-cover bg-center rounded-full"
              src="/Image.jpg"
              alt="group"
            />
            <h5 className="text-[15px] font-open_sens font-semibold text-white">
              mahammud hassan limon
            </h5>
            <button className="text-sm font-inter font-bold bg-purple-500 px-5 py-[5px] rounded-full text-white cursor-pointer hover:opacity-70">
              Join
            </button>
          </li>
        </ul>
      </section>
    </>
  );
};

export default Group;
