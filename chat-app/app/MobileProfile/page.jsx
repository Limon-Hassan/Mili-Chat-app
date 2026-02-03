'use client';

import React, { useEffect, useState } from 'react';
import VoiceChatCard from '../../components/VoiceChatCard';
import AllFriend from '../../components/AllFriend';
import { MoveLeft, Plus } from 'lucide-react';
import { RiEdit2Fill } from 'react-icons/ri';
import Stories from '../../components/Stories';
import Edite from '../../components/Edite';
import ShowStatus from '../../components/ShowStatus';
import SeeProfileFicture from '../../components/SeeProfileFicture';
import AddStory from '../../components/AddStory';
import BlockUser from '../../components/BlockUser';
import { useDynamicHeight } from '@/customHook/useDynamicHeight';
import { useGraphQL } from '../../components/Hook/useGraphQL';
import { uploadToCloudinary } from '@/lib/cloudinaryClient';
import ShowStatusForOther from '../../components/ShowStatusForOther';
import Big_Loading from '@/components/Big_Loading';
import { useSearchParams } from 'next/navigation';
import { IoPersonAddSharp } from 'react-icons/io5';

const page = () => {
  let { request, loading, error } = useGraphQL();
  let dynamic = useDynamicHeight({ baseHeight: 555, basePx: 255, maxPx: 500 });
  const [active, setActive] = useState({
    status: false,
    story: false,
    picture: false,
    ImageToggole: false,
  });

  const searchParams = useSearchParams();
  const uid = searchParams.get('id');
  let [user, setUser] = useState({});
  let [stories, setStories] = useState([]);
  let [friends, setFriends] = useState([]);
  let [ActiveStories, setActiveStories] = useState([]);

  let toggoleActive = key => {
    setActive(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const fetchUser = async () => {
    if (!uid) return;
    const query = `
          query GetUserProfile($userId: ID!) {
            getUserProfile(userId: $userId) {
              id
              name
              avatar
              bio
              voiceIntro {
                url
              }
            }
          }
        `;

    const data = await request(query, {
      userId: uid,
    });

    setUser(data.getUserProfile);
  };

  let fetchUserFriend = async () => {
    if (!uid) return;
    const query = `query GetUserFriend($userId: ID!) {
      getUserFriend(userId: $userId) {
        id
        name
        avatar
      }
    }
    
        `;
    const data = await request(query, {
      userId: uid,
    });
    console.log(data);
    setFriends(data.getUserFriend);
  };

  let fetchUserStories = async () => {
    if (!uid) return;
    const query = `query GetUserStories($userId: ID!) {
      getUserStories(userId: $userId) {
        id
        privacy
        updatedAt
        user {
          id
          name
          avatar
        }
        stories {
          id
          video
          createdAt
          expiresAt
          status
          
        }
      }
    }
    `;
    const data = await request(query, {
      userId: uid,
    });
    console.log(data);
    setActiveStories(data.getUserStories);
  };

  useEffect(() => {
    fetchUser();
    fetchUserFriend();
    fetchUserStories();
  }, [uid]);

  return (
    <>
      {loading && <Big_Loading />}
      <button
        onClick={() => (window.location.href = '/')}
        className="absolute top-5 right-0 w-20 h-10 bg-white flex items-center justify-center rounded-l-lg z-10 cursor-pointer active:scale-90"
      >
        <MoveLeft size={30} className="text-purple-500" />
      </button>
      <section className="mobile:w-full tablet:w-full laptop:w-full p-2 bg-gray-400/30 rounded-lg border border-gray-300 mobile:absolute mobile:top-5 mobile:left-0 tablet:absolute tablet:top-0 tablet:left-0 laptop:absolute laptop:top-0 laptop:left-0 ">
        <div className="border-b border-gray-400">
          <h2 className="text-[34px] font-bold font-inter text-white mb-2">
            Account
          </h2>
          <p className="mobile:text-sm tablet:text-lg laptop:text-lg font-normal font-inter text-gray-200 mobile:mb-2 tablet:mb-3 laptop:mb-5">
            You can see user profile content if you are friend with this person
            or public, content will show by user privacy.
          </p>
        </div>
        <div
          className="mobile:mt-6 tablet:mt-10 laptop:mt-10 flex flex-col mx-auto gap-5 p-2 overflow-y-auto"
          style={{ maxHeight: `${dynamic}px` }}
        >
          <div className="relative">
            <div
              onClick={() => toggoleActive('ImageToggole')}
              className={`w-75 h-75 border-[6px] rounded-full mx-auto ${ActiveStories.length > 0 ? 'border-purple-600 ' : 'border-white'} overflow-hidden`}
            >
              <img
                className="w-full h-full rounded-full object-cover active:scale-110 ease-in-out transition-all duration-500"
                src={user.avatar || '/defult.png'}
                alt="Image"
              />
            </div>
            <div
              className={`${
                active.ImageToggole ? 'block' : 'hidden'
              } absolute left-37.5 z-20`}
            >
              <div className="relative bg-white text-black p-2 rounded-lg w-44 before:absolute before:-top-2 before:left-6 before:w-0 before:h-0 before:border-l-8 before:border-r-8 before:border-b-8 before:border-l-transparent before:border-r-transparent before:border-b-white ">
                <ul>
                  {ActiveStories.length > 0 && (
                    <li
                      onClick={() => toggoleActive('story')}
                      className="cursor-pointer hover:bg-gray-300 active:bg-gray-300 font-medium p-1 rounded-sm"
                    >
                      See story
                    </li>
                  )}
                  {user.ProfilePicLock === false && (
                    <li
                      onClick={() => toggoleActive('picture')}
                      className="cursor-pointer hover:bg-gray-300 active:bg-gray-300 font-medium p-1 rounded-sm"
                    >
                      See profile picture
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center border-b border-gray-400 pb-5 mobile:mt-5 tablet:mt-0 laptop:mt-0">
            <div className="relative mb-3.5">
              <h3 className="uppercase flex items-center gap-3.5 mobile:text-[22px] tablet:text-2xl laptop:text-2xl font-bold font-inter text-white">
                {user.name || 'user'}
                {user.email === 'mahammudhassanlimon@gmail.com' && (
                  <>
                    <span className="mobile:hidden tablet:flex laptop:flex items-center gap-1 text-sm bg-gray-700 w-30 justify-center h-10 border border-gray-500 rounded-full">
                      Creator
                      <img
                        className=" h-6 object-contain bg-center "
                        src="/verified-account.png"
                        alt="verify"
                      />
                    </span>
                    <span className="mobile:absolute mobile:-top-9.5 mobile:right-0  tablet:hidden laptop:hidden flex items-center gap-1 text-[12px] bg-gray-700 w-25 justify-center h-8.75 border border-gray-500 rounded-full z-10">
                      Creator
                      <img
                        className=" h-5 object-contain bg-center "
                        src="/verified-account.png"
                        alt="verify"
                      />
                    </span>
                  </>
                )}
              </h3>
              <h3 className="text-sm font-normal font-inter text-white mobile:my-3 tablet:mt-3.5 laptop:mt-3.5">
                {user.bio || 'Edit your bio From Edit Profile'}
              </h3>
            </div>
            <div className="flex flex-col gap-1 items-center justify-between mb-2">
              {user.voiceIntro && (
                <VoiceChatCard audioSrc={user.voiceIntro} status="online" />
              )}
            </div>
            <button className="flex items-center gap-1 text-md font-inter font-semibold text-white bg-purple-500 w-75  justify-center py-2 rounded-full mt-4 hover:bg-purple-600 cursor-pointer">
              <span>
                <IoPersonAddSharp />
              </span>
              Add Friend
            </button>
          </div>
          <AllFriend friends={friends} />
          <Stories />
          {active.story && ActiveStories.length > 0 && (
            <ShowStatusForOther
              story={ActiveStories}
              onClose={() => setActive(false)}
            />
          )}
          {active.picture && (
            <SeeProfileFicture
              src={user.avatar || '/defult.png'}
              onClose={() => setActive(false)}
            />
          )}
        </div>
      </section>
    </>
  );
};

export default page;
