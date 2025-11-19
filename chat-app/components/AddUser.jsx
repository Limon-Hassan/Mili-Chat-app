import { UserPlus } from 'lucide-react';
import React from 'react';

const AddUser = () => {
  return (
    <>
      <section className="w-[400px] h-auto bg-transparent border border-white p-5 rounded-lg">
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
        <ul className="flex flex-col gap-1 mt-5 overflow-auto w-full max-h-80">
          <li className="flex items-center justify-between bg-gray-400/30 rounded-lg p-2">
            <div className='flex items-center gap-2.5'>
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

export default AddUser;
