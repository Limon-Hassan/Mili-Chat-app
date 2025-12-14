import React from 'react';

const Stories = () => {
  return (
    <section>
      <div>
        <h2 className="text-2xl flex items-center justify-between font-bold font-inter text-white mb-5">
          Stories
          <span className="text-[16px] font-inter font-semibold cursor-pointer underline active:text-blue-500">
            see all
          </span>
        </h2>
        <div className="grid mobile:grid-cols-3 tablet:grid-cols-4 laptop:grid-cols-5 computer:grid-cols-6 items-center gap-2.5 border border-gray-400 mobile:p-2 tablet:p-3 laptop:p-5 computer:p-5 rounded-lg">
          <div className="flex flex-col items-center justify-center mobile:p-1  tablet:p-2.5 laptop:p-2.5 computer:p-2.5 border border-gray-300 rounded-lg mx-auto">
            <img
              className="w-[100px] h-[100px] object-cover rounded-md"
              src="/Image.jpg"
              alt="User"
            />
            <h4 className="text-sm text-center mx-auto font-inter font-medium mt-2">
              24-09-2023 12:00pm
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center mobile:p-1  tablet:p-2.5 laptop:p-2.5 computer:p-2.5 border border-gray-300 rounded-lg mx-auto">
            <img
              className="w-[100px] h-[100px] object-cover rounded-md"
              src="/Image.jpg"
              alt="User"
            />
            <h4 className="text-sm text-center mx-auto font-inter font-medium mt-2">
              24-09-2023 12:00pm
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center mobile:p-1  tablet:p-2.5 laptop:p-2.5 computer:p-2.5 border border-gray-300 rounded-lg mx-auto">
            <img
              className="w-[100px] h-[100px] object-cover rounded-md"
              src="/Image.jpg"
              alt="User"
            />
            <h4 className="text-sm text-center mx-auto font-inter font-medium mt-2">
              24-09-2023 12:00pm
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center mobile:p-1  tablet:p-2.5 laptop:p-2.5 computer:p-2.5 border border-gray-300 rounded-lg mx-auto">
            <img
              className="w-[100px] h-[100px] object-cover rounded-md"
              src="/Image.jpg"
              alt="User"
            />
            <h4 className="text-sm text-center mx-auto font-inter font-medium mt-2">
              24-09-2023 12:00pm
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center mobile:p-1  tablet:p-2.5 laptop:p-2.5 computer:p-2.5 border border-gray-300 rounded-lg mx-auto">
            <img
              className="w-[100px] h-[100px] object-cover rounded-md"
              src="/Image.jpg"
              alt="User"
            />
            <h4 className="text-sm text-center mx-auto font-inter font-medium mt-2">
              24-09-2023 12:00pm
            </h4>
          </div>
          <div className="flex flex-col items-center justify-center mobile:p-1  tablet:p-2.5 laptop:p-2.5 computer:p-2.5 border border-gray-300 rounded-lg mx-auto">
            <img
              className="w-[100px] h-[100px] object-cover rounded-md"
              src="/Image.jpg"
              alt="User"
            />
            <h4 className="text-sm text-center mx-auto font-inter font-medium mt-2">
              24-09-2023 12:00pm
            </h4>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stories;
