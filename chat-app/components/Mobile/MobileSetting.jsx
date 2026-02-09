'use client';

import React, { useEffect, useState } from 'react';
import VoiceChatCard from '../VoiceChatCard';
import AllFriend from '../AllFriend';
import { Plus } from 'lucide-react';
import { RiEdit2Fill } from 'react-icons/ri';
import Stories from '../Stories';
import Edite from '../Edite';
import ShowStatus from '../ShowStatus';
import SeeProfileFicture from '../SeeProfileFicture';
import AddStory from '../AddStory';
import BlockUser from '../BlockUser';
import { useDynamicHeight } from '@/customHook/useDynamicHeight';
import { useGraphQL } from '../Hook/useGraphQL';
import { uploadToCloudinary } from '@/lib/cloudinaryClient';
import ShowStatusForOther from '../ShowStatusForOther';
import { useSocket } from '../Hook/useSocket';

const MobileSetting = () => {
  let { request, loading, error } = useGraphQL();
  let dynamic = useDynamicHeight({ baseHeight: 555, basePx: 255, maxPx: 500 });
  const [active, setActive] = useState({
    status: false,
    story: false,
    picture: false,
    StoryUpload: false,
    edite: false,
    ImageToggole: false,
  });

  let [user, setUser] = useState({});
  let isMe = true;
  let [stories, setStories] = useState([]);
  let [friends, setFriends] = useState([]);
  let [ActiveStories, setActiveStories] = useState([]);

  let fetchMe = async () => {
    let mutation = `
       query Me {
         me {
           id
           name
           avatar
           email
           bio
           ProfilePicLock
           voiceIntro{
             url
           }
           blockedByMe {
             id
             name
             avatar
           }
 
           friends {
             id
             name
             avatar
           }
         }
       }
     `;

    let data = await request(mutation);
    setFriends(data.me.friends);
    setUser(data.me);
  };

  let fetchStory = async () => {
    try {
      let mutation = `
          query {
            getAllStories {
              id
              user {
                id
                name
                avatar
              }
              stories {
                id
                video
                expiresAt
                createdAt
                status
                reactions {
                  user { id name avatar }
                  type
                  reactedAt
                }
                seenBy {
                  user { id name avatar }
                  seenAt
                }
              }
            }
          }
        `;

      let data = await request(mutation);
      setStories(data.getAllStories);
    } catch (error) {
      console.log(error);
    }
  };

  let fetchActiveStory = async () => {
    try {
      let mutation = `
          query {
            getNewStories {
              id
              user {
                id
                name
                avatar
              }
              stories {
                id
                video
                expiresAt
                createdAt
                status
                reactions {
                  user { id name avatar }
                  type
                  reactedAt
                }
                seenBy {
                  user { id name avatar }
                  seenAt
                }
              }
            }
          }
        `;

      let data = await request(mutation);
      setActiveStories(data.getNewStories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchStory();
    fetchActiveStory();
    fetchMe();
  }, []);

  let toggoleActive = key => {
    setActive(prev => ({ ...prev, [key]: !prev[key] }));
  };

  let handleStoryUpload = async file => {
    try {
      let fileUrl = await uploadToCloudinary(file, 'story', 'video');

      let mutation = `
        mutation CreateStory($video: String!) {
          createStory(video: $video) {
            id
             stories {
          video
          expiresAt
        }
          }
        }
      `;

      let data = await request(mutation, { video: fileUrl });
    } catch (error) {
      console.log(error);
    }
  };

  useSocket({
    userId: localStorage.getItem('userId'),
    onEvents: {
      newStory: story => {
        fetchStory();
        fetchActiveStory();
      },

      storySeen: data => {
        setActiveStories(prev =>
          prev.map(story => {
            if (story.id !== data.storyId) return story;

            return {
              ...story,
              stories: story.stories.map(item => {
                if (item.id !== data.storyItemId) return item;

                return {
                  ...item,
                  seenBy: [...item.seenBy, data.seenBy],
                };
              }),
            };
          }),
        );
      },

      storyReaction: data => {
        setActiveStories(prev =>
          prev.map(story => {
            if (story.id !== data.storyId) return story;

            return {
              ...story,
              stories: story.stories.map(item => {
                if (item.id !== data.storyItemId) return item;

                return {
                  ...item,
                  reactions: [...item.reactions, data.reaction],
                };
              }),
            };
          }),
        );
      },

      profileUpdated: avatar => {
        fetchMe();
      },
    },
  });

  return (
    <>
      <section className="mobile:w-full tablet:w-full laptop:w-full p-2 bg-gray-400/30 rounded-lg border border-gray-300 mobile:absolute mobile:top-22.5 mobile:left-0 tablet:absolute tablet:top-27.5 tablet:left-0 laptop:absolute laptop:top-27.5 laptop:left-0 ">
        <div className="border-b border-gray-400">
          <h2 className="text-[34px] font-bold font-inter text-white">
            Account
          </h2>
          <p className="mobile:text-sm tablet:text-lg laptop:text-lg font-normal font-inter text-gray-200 mobile:mb-2 tablet:mb-3 laptop:mb-5">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <div
          className="mobile:mt-6 tablet:mt-10 laptop:mt-10 flex flex-col mx-auto gap-5 p-2 overflow-y-auto"
          style={{ maxHeight: `${dynamic}px` }}
        >
          <div className="relative">
            <button
              onClick={() => toggoleActive('edite')}
              className="absolute top-0 right-0 flex items-center gap-1 text-white bg-purple-600 rounded-md px-3 py-2 hover:bg-purple-700 cursor-pointer font-semibold text-[16px]"
            >
              <RiEdit2Fill /> Edite
            </button>
            <div
              onClick={() => toggoleActive('ImageToggole')}
              className={`w-75 h-75 border-[6px] rounded-full ${ActiveStories.length > 0 ? 'border-purple-600 ' : 'border-white'} overflow-hidden`}
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
                  {(isMe || user.ProfilePicLock === false) && (
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
            <span
              onClick={() => toggoleActive('StoryUpload')}
              className="absolute bottom-0 left-0 w-12.5 h-12.5 bg-purple-600 flex items-center justify-center rounded-full cursor-pointer border border-gray-500"
            >
              <Plus />
            </span>
          </div>
          <div className="flex flex-col items-center justify-between border-b border-gray-400 pb-5 mobile:mt-5 tablet:mt-0 laptop:mt-0">
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
              <h3 className="text-sm font-normal font-inter text-white mobile:my-4 tablet:mt-3.5 laptop:mt-3.5">
                {user.bio || 'Edit your bio From Edit Profile'}
              </h3>
            </div>
            <div className="flex flex-col gap-1 items-center justify-between">
              {user.voiceIntro && (
                <VoiceChatCard audioSrc={user.voiceIntro} status="online" />
              )}
            </div>
          </div>
          <AllFriend friends={friends} />
          <Stories />
          <BlockUser />
          {active.edite && (
            <Edite setActive={setActive} onClose={() => setActive(false)} />
          )}
          {active.StoryUpload && (
            <AddStory
              onSave={handleStoryUpload}
              onClose={() => setActive(false)}
            />
          )}
          {active.story && ActiveStories.length > 0 && (
            <ShowStatus
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

export default MobileSetting;
