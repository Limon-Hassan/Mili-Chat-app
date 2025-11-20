import React from 'react';
import VoiceChatCard from './VoiceChatCard';

const Setting = () => {
  return (
    <>
      <section className="w-[1200px] p-5 bg-gray-400/30 rounded-lg border border-gray-300">
        <div>
          <div className="border-b border-gray-400">
            <h2 className="text-[34px] font-bold font-inter text-white">
              Account
            </h2>
            <p className="text-lg font-normal font-inter text-gray-200 mb-5">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <div className="mt-10 flex flex-col mx-auto gap-5 p-5">
            <img
              className="w-[300px] h-[300px] rounded-full"
              src="/Image.jpg"
              alt="Image"
            />
            <div className="flex items-center justify-between">
              <div>
                <h3 className="uppercase flex items-center gap-3.5 text-2xl font-bold font-inter text-white">
                  mahammud hassan limon
                  <span className="flex items-center gap-1 text-sm bg-gray-700 w-[120px] justify-center h-10 border border-gray-500 rounded-full">
                    Creator
                    <img
                      className=" h-6 object-contain bg-center "
                      src="/verified-account.png"
                      alt="verify"
                    />
                  </span>
                </h3>
                <h3 className="text-sm font-normal font-inter text-white mt-3.5">
                  I'm Full stack Developer || Web Designer || MERN stack
                  Developer
                </h3>
              </div>
              <div>
                <VoiceChatCard
                  audioSrc="/Sayfalse  Nulteex - AL NACER!.mp3"
                  status="online"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Setting;
