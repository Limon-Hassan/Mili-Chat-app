'use client';

import { useState, useRef, useEffect, use } from 'react';
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Trash,
  Smile,
  Check,
} from 'lucide-react';
import useScrollToBottom from '@/customHook/useScrollToBottom';
import NormalChatUI from '../../components/NormalChatUI';
import LiveWaveform from '../../components/LiveWaveform';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import AudioPlayer from '../../components/AudioPlayer';
import { useSearchParams } from 'next/navigation';
import { useGraphQL } from '@/components/Hook/useGraphQL';
import { useRouter } from 'next/navigation';
import twemoji from 'twemoji';
import { uploadToCloudinary } from '@/lib/cloudinaryClient';
import SeeProfileFicture from '@/components/SeeProfileFicture';
import EmojiPicker from 'emoji-picker-react';
import { useSocket } from '@/components/Hook/useSocket';
import { getSocket } from '@/lib/socket';
import Loader from '@/components/Loader';
import { Comment } from 'react-loader-spinner';
import BlockMenu from '@/components/BlockMenu';

export default function ClientMessage() {
  let router = useRouter();
  let { request, loading, error } = useGraphQL();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  const avatar = searchParams.get('avatar');
  const conversationId = searchParams.get('conversationId');

  let [conversation, setConversation] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  let [messages, setMessages] = useState([]);
  let [me, setMe] = useState(null);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const emojiRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [active, setActive] = useState(false);
  const [activePicture, setActivePicture] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [reactionFor, setReactionFor] = useState(null);
  let longPressRef = useRef(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [analyser, setAnalyser] = useState(null);

  const [onlineMap, setOnlineMap] = useState({});
  const [lastSeenMap, setLastSeenMap] = useState({});
  let [typing, setTyping] = useState({});
  let [blockMenu, setBlockMenu] = useState(false);
  let [HeBlockMe, setHeBlockMe] = useState({});
  let [IBlockHim, setIBlockHim] = useState({});

  const [input, setInput] = useState('');

  const bottomRef = useScrollToBottom([messages, typing[userId]]);

  const startRecording = async () => {
    setIsRecording(true);
    setRecordTime(0);
    audioChunksRef.current = [];

    timerRef.current = setInterval(() => {
      setRecordTime(prev => prev + 1);
    }, 1000);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 64;
    source.connect(analyserNode);
    setAnalyser(analyserNode);

    const recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      if (e.data.size > 0) audioChunksRef.current.push(e.data);
    };

    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    mediaRecorder?.stop();
    setAnalyser(null);
  };

  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  };

  let handleSendRecording = async () => {
    if (!mediaRecorder) return;
    setIsRecording(false);
    clearInterval(timerRef.current);
    setAnalyser(null);

    mediaRecorder.onstop = async () => {
      if (audioChunksRef.current.length === 0) return;

      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm',
      });
      const file = new File([audioBlob], 'voice-message.webm', {
        type: 'audio/webm',
      });

      await sendMessage({ audio: file });
    };

    mediaRecorder.stop();
  };

  let handleTouch = msgID => {
    longPressRef.current = setTimeout(() => {
      setReaction(msgID);
    }, 500);
  };

  let handleTouchEND = () => {
    clearTimeout(longPressRef.current);
  };

  let handleTouchMOVE = () => {
    clearTimeout(longPressRef.current);
  };

  let handleReact = async (messageId, emoji) => {
    try {
      let mutation = `
      mutation ReactToMessage($messageId: ID!, $emoji: String!) {
        reactToMessage(messageId: $messageId, emoji: $emoji) {
          id
          reactions {
            emoji
            user {
              id
              name
              avatar
            }
          }
        }
      }
    `;

      let data = await request(mutation, { messageId, emoji });

      setMessages(prev => {
        const newMessages = prev.map(msg =>
          msg.id === messageId
            ? { ...msg, reactions: data.reactToMessage.reactions }
            : msg,
        );
        return newMessages;
      });
    } catch (error) {
      console.log(error);
    }
  };

  let handleDelete = async messageId => {
    try {
      let Delete_Query = `
  mutation DeleteMessage($messageId: ID!) {
    deleteMessage(messageId: $messageId)
  }
`;
      let data = await request(Delete_Query, { messageId: messageId });
      if (data.deleteMessage === true) {
        setMessages(prev => prev.filter(m => m.id !== messageId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  let handleBlock = async userId => {
    try {
      const query = `
    mutation BlockUser($blockerId: ID!) {
      blockUser(blockerId: $blockerId) {
         id
         name
        
           blockedByMe {
      id
      name
      avatar
    }
      }
    }
  `;
      const data = await request(query, { blockerId: userId });
      setMessages([]);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  let handCLickOutside = e => {
    if (emojiRef.current && !emojiRef.current.contains(e.target)) {
      setReaction(null);
      setReactionFor(null);
    }
  };

  useEffect(() => {
    if (!activeConversationId) return;
    let conversationId = activeConversationId;
    const socket = getSocket();
    socket.emit('activeChat', conversationId);
    socket.emit('chat:open', { conversationId });

    return () => {
      socket.emit('chat:close', { conversationId });
    };
  }, [activeConversationId]);

  useEffect(() => {
    if (reactionFor) {
      document.addEventListener('mousedown', handCLickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handCLickOutside);
    };
  }, [reactionFor]);

  let handleClearConv = async convId => {
    try {
      let query = `
  mutation DeleteConversation($conversationId: ID!) {
    deleteConversation(conversationId: $conversationId)
  }
`;
      let data = await request(query, { conversationId: convId });
      setMessages([]);
      router.replace('/', { scroll: false });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleClick = e => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    let fetchConversations = async () => {
      try {
        const query = `
      query GetConversations {
        getConversation {
          id
          isGroup
          group        
          lastMessage
          lastMessageType
          lastMessageAt
          participants { 
            id
            name
            avatar
          }
          otherUser { 
            id
            name
            avatar
          }
        }
      }
    `;

        let data = await request(query);
        setConversation(data.getConversation);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!conversationId || conversation.length === 0) return;

    const validConversation = conversation.find(
      conv => conv.id === conversationId,
    );
    if (!validConversation) {
      console.warn('Invalid conversation access attempt');

      alert('Access Denied');
      router.replace('/', { scroll: false });

      return;
    }
    setActiveConversationId(validConversation.id || null);
  }, [conversationId, conversation]);

  const sendMessage = async ({ audio } = {}) => {
    if (!input.trim() && attachments.length === 0 && !audio) return;
    try {
      let uploadedAttachments = [];
      for (let att of attachments) {
        const url = await uploadToCloudinary(
          att.file,
          'chat_attachments',
          att.type === 'image' ? 'image' : 'video',
        );
        if (url) {
          uploadedAttachments.push({ type: att.type, url });
        }
      }
      if (audio) {
        const audioUrl = await uploadToCloudinary(
          audio,
          'chat_attachments',
          'video',
        );
        if (audioUrl) {
          uploadedAttachments.push({ type: 'audio', url: audioUrl });
        }
      }
      let mutation;
      let variables;
      if (!activeConversationId) {
        mutation = `
        mutation SendFirst(
          $receiverId: ID!,
          $text: String,
          $mediaUrl: String,
          $type: String
        ) {
          sendMessage(
            receiverId: $receiverId,
            text: $text,
            mediaUrl: $mediaUrl,
            type: $type
          ) {
            id
            text
            mediaUrl
            type
            sender { id name avatar }
            reactions {
            emoji
            user { id name avatar }
            }
            conversation { id }
            createdAt
            deliveryStatus
          }
        }
      `;

        let firstAttachment = uploadedAttachments[0];
        variables = {
          receiverId: userId,
          text:
            input.trim() ||
            (firstAttachment ? `[${firstAttachment.type}]` : ''),
          type: firstAttachment ? firstAttachment.type : 'text',
          mediaUrl: firstAttachment ? firstAttachment.url : null,
        };
      } else {
        mutation = `
        mutation SendStrict(
          $conversationId: ID!,
          $text: String,
          $mediaUrl: String,
          $type: String
        ) {
          sendMessageStrict(
            conversationId: $conversationId,
            text: $text,
            mediaUrl: $mediaUrl,
            type: $type
          ) {
            id
            text
            mediaUrl
            type
            sender { id name avatar }
            reactions {
            emoji
            user { id name avatar }
            }
            deliveryStatus
            createdAt
          }
        }
      `;

        let firstAttachment = uploadedAttachments[0];
        variables = {
          conversationId: activeConversationId,
          text:
            input.trim() ||
            (firstAttachment ? `[${firstAttachment.type}]` : ''),
          type: firstAttachment ? firstAttachment.type : 'text',
          mediaUrl: firstAttachment ? firstAttachment.url : null,
        };
      }
      let data = await request(mutation, variables);
      const messageData = data.sendMessage || data.sendMessageStrict;
      setMessages(prev => [...prev, messageData]);
      setInput('');
      setAttachments([]);
      const socket = getSocket();
      socket.emit('sendMessage', {
        toUserId: userId,
        messageId: messageData.id,
        conversationId: activeConversationId
          ? activeConversationId
          : messageData.conversation.id,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setMessages([]);
  }, [conversationId]);

  useEffect(() => {
    let FetchMessages = async () => {
      try {
        if (!activeConversationId) return;
        let query = `query GetMessages($conversationId: ID!) {
  getMessages(conversationId: $conversationId) {
    id
    text
    mediaUrl
    type
    duration
    createdAt
    deliveryStatus
    sender { id name avatar }
    receiver { id name avatar }
     reactions {
    emoji
    user { id name avatar }
  }
  }
}`;

        const data = await request(query, {
          conversationId: activeConversationId,
        });
        if (data.getMessages) setMessages(data.getMessages);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMessages();
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;
    let MarkAsDelivered = async () => {
      try {
        const MARK_AS_DELIVERED = `
  mutation MarkAsDelivered($conversationId: ID!) {
    markAsDelivered(conversationId: $conversationId)
  }
`;
        let data = await request(MARK_AS_DELIVERED, {
          conversationId: activeConversationId,
        });
      } catch (error) {
        console.log(error);
      }
    };

    MarkAsDelivered();
  }, [activeConversationId]);

  useEffect(() => {
    if (!activeConversationId) return;
    let MarkAsRead = async () => {
      try {
        const MARK_AS_READ = `
  mutation MarkAsRead($conversationId: ID!) {
    markAsRead(conversationId: $conversationId)
  }
`;

        let data = await request(MARK_AS_READ, {
          conversationId: activeConversationId,
        });
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    MarkAsRead();
  }, [activeConversationId]);

  useEffect(() => {
    let fetchMe = async () => {
      try {
        const query = `query {
  me {
    id
    WhichBlockedByMe {
      id
      name
      avatar
    }
    WhereIBlocked {
      id
      name
      avatar
    }
  }
}`;
        const data = await request(query);
        console.log(data);

        const iBlocked = data.me.WhichBlockedByMe.some(u => u.id === userId);

        setIBlockHim(prev => ({ ...prev, [userId]: iBlocked }));

        const heBlocked = data.me.WhereIBlocked.some(u => u.id === userId);
        setHeBlockMe(prev => ({ ...prev, [userId]: heBlocked }));
      } catch (err) {
        console.log(err);
      }
    };
    fetchMe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUserId = localStorage.getItem('userId');
      setMe(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!me) return;
    const socket = getSocket();
    socket.emit('register', me);
  }, [me]);

  useSocket({
    userId: me,
    onEvents: {
      'friend-online': ({ userId }) => {
        setOnlineMap(prev => ({ ...prev, [userId]: true }));
        localStorage.removeItem(`lastSeen_${userId}`);
      },
      'friend-offline': ({ userId, lastSeen }) => {
        setOnlineMap(prev => ({ ...prev, [userId]: false }));
        localStorage.setItem(
          `lastSeen_${userId}`,
          new Date(lastSeen).getTime(),
        );
      },
      newMessage: ({ message }) => {
        setMessages(prev => [...prev, message]);
      },

      typing: ({ from }) => {
        setTyping(prev => ({ ...prev, [from]: true }));
        setTimeout(() => {
          setTyping(prev => ({ ...prev, [from]: false }));
        }, 2000);
      },

      messageDelivered: ({ messageId }) => {
        console.log(messageId);
        setMessages(prev =>
          prev.map(m =>
            m._id === messageId ? { ...m, deliveryStatus: 'delivered' } : m,
          ),
        );
      },

      messageSeen: ({ messageId }) => {
        console.log(messageId);
        setMessages(prev =>
          prev.map(m =>
            m.id === messageId
              ? { ...m, deliveryStatus: 'seen', isRead: true }
              : m,
          ),
        );
      },

      messageUserBlocked: ({ byUserId }) => {
        // He blocked me

        if (byUserId === userId) {
          setHeBlockMe(prev => ({ ...prev, [byUserId]: true }));
        }
      },
      messageUserBlockedSelf: ({ blockedUserId }) => {
        // I blocked him
        if (blockedUserId === userId) {
          setIBlockHim(prev => ({ ...prev, [blockedUserId]: true }));
        }
      },
    },
  });

  useEffect(() => {
    const savedLastSeen = localStorage.getItem(`lastSeen_${userId}`);
    if (savedLastSeen) {
      setLastSeenMap(prev => ({
        ...prev,
        [userId]: parseInt(savedLastSeen),
      }));
    }
  }, [userId]);

  const getLastSeenText = timestamp => {
    if (!timestamp) return 'Offline';
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 30) return 'Active just now';
    if (minutes < 60) return `Active ${minutes}m ago`;
    if (hours < 24) return `Active ${hours}h ago`;
    return `Active ${days}d ago`;
  };

  const isOnline = onlineMap[userId] === true;

  const heBlocked = !!HeBlockMe?.[userId];
  const iBlocked = !!IBlockHim?.[userId];

  return (
    <>
      <div
        className="fixed inset-0 w-full flex flex-col backdrop-blur-md bg-transparent border shadow-md mx-auto max-w-5xl"
        style={{ height: 'var(--app-height)' }}
      >
        <div className="w-full px-5 py-4 border-b bg-transparent flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-2">
            <img
              className="w-12.5 h-12.5 object-cover bg-center rounded-full"
              src={avatar || '/defult.png'}
              alt="group"
            />
            <div>
              <h2 className="font-semibold text-[15px] font-open_sens truncate w-42">
                {name}
              </h2>
              {!heBlocked && !iBlocked && (
                <p
                  className={`text-[13px] font-bold ${isOnline ? 'text-green-600' : 'text-gray-500'}`}
                >
                  {isOnline ? 'Online' : getLastSeenText(lastSeenMap[userId])}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-5 relative">
            <Phone className="cursor-pointer" />
            <Video className="cursor-pointer" />
            <MoreVertical
              className="cursor-pointer"
              onClick={() => setOpenMenu(!openMenu)}
            />

            {openMenu && (
              <div
                ref={menuRef}
                className="absolute top-8 right-0 bg-black shadow-xl rounded-md w-45 py-2 border z-9999"
              >
                {!heBlocked && (
                  <p
                    onClick={() => {
                      setBlockMenu(!blockMenu);
                      setOpenMenu(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                  >
                    Block
                  </p>
                )}
                <p className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer">
                  Theme
                </p>
                <p
                  onClick={() => handleClearConv(activeConversationId)}
                  className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer"
                >
                  Clear Chat
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto  px-5 py-4 flex flex-col gap-4.5">
          <div className="mx-auto mt-5.5 mb-15">
            <img
              className="w-35 h-35 object-cover bg-center rounded-full mx-auto"
              src={avatar || 'defult.png'}
              alt="group"
            />
            <h2 className="text-center mx-auto text-2xl font-medium mt-4 font-open_sens">
              {name || 'User'}
            </h2>

            <p className="text-center text-sm font-medium mt-2 font-open_sens">
              You are both chimmy Friends
            </p>
          </div>

          {messages.map((msg, index) => {
            const isMine = msg.sender.id === me;
            const bgClass =
              msg.type === 'text' || msg.type === 'link'
                ? isMine
                  ? 'bg-purple-600 text-white rounded-br-none px-4 py-2.5 '
                  : 'bg-white text-gray-600 rounded-bl-none px-4 py-2.5'
                : '';
            return (
              <div
                key={index}
                onTouchStart={() => handleTouch(msg.id)}
                onTouchEnd={handleTouchEND}
                onTouchMove={handleTouchMOVE}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`relative max-w-[80%] rounded-xl flex items-center gap-2 ${bgClass}`}
                >
                  {msg.type === 'image' && msg.mediaUrl ? (
                    <img
                      src={msg.mediaUrl}
                      alt="attachment"
                      onClick={() => {
                        setActivePicture(msg.mediaUrl);
                        setActive(true);
                      }}
                      className="max-w-50 rounded-lg"
                    />
                  ) : msg.type === 'video' && msg.mediaUrl ? (
                    <video
                      src={msg.mediaUrl}
                      controls
                      className="max-w-50 rounded-lg"
                    />
                  ) : msg.type === 'audio' && msg.mediaUrl ? (
                    <AudioPlayer src={msg.mediaUrl} />
                  ) : (
                    <span
                      className="text-sm leading-5 font-normal font-open_sens"
                      dangerouslySetInnerHTML={{
                        __html: twemoji.parse(msg.text, {
                          folder: 'svg',
                          ext: '.svg',
                          className: 'w-5 h-5 inline font-open_sens',
                        }),
                      }}
                    ></span>
                  )}

                  {reaction === msg.id && (
                    <div
                      className={`absolute top-1/2 -translate-y-1/2 flex gap-px z-50 ${isMine ? '-left-18.5' : '-right-18.5'} `}
                    >
                      {isMine && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="w-9 h-9 text-white "
                        >
                          <Trash />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setReactionFor(prev =>
                            prev === msg.id ? null : msg.id,
                          );
                        }}
                        className="w-9 h-9 text-white"
                      >
                        <Smile />
                      </button>
                    </div>
                  )}

                  {msg.reactions?.length > 0 && (
                    <div
                      className={`absolute -bottom-3 ${
                        isMine ? 'left-0' : 'right-0'
                      } bg-white shadow w-6 h-5 items-center justify-center rounded-full text-xs flex`}
                    >
                      {msg.reactions.map((r, i) => {
                        return (
                          <span
                            key={i}
                            dangerouslySetInnerHTML={{
                              __html: twemoji.parse(r.emoji, {
                                folder: 'svg',
                                ext: '.svg',
                                className: 'w-3.5 h-3.5 inline',
                              }),
                            }}
                          ></span>
                        );
                      })}
                    </div>
                  )}

                  {isMine &&
                    messages.length > 0 &&
                    messages[messages.length - 1].id === msg.id &&
                    msg.deliveryStatus && (
                      <div className="absolute -bottom-2.5 right-0 ">
                        {msg.deliveryStatus === 'sent' && (
                          <span className="text-white text-[12px] font-medium flex items-center gap-1 -mr-2.5 -mb-2.5">
                            Sent
                            <span className="w-4 h-4 border border-gray-500 rounded-full flex items-center justify-center">
                              <Check size={12} />
                            </span>
                          </span>
                        )}
                        {msg.deliveryStatus === 'delivered' && (
                          <span className="text-white text-[12px] font-medium flex items-center gap-1 -mr-2.5 -mb-2.5">
                            Delivered
                            <span className="w-4 h-4 rounded-full flex items-center justify-center bg-purple-500">
                              <Check className="text-white" size={12} />
                            </span>
                          </span>
                        )}
                        {msg.deliveryStatus === 'seen' && (
                          <span className="text-white text-[12px] font-medium flex items-center -mb-2">
                            Seen
                          </span>
                        )}
                      </div>
                    )}
                </div>
                {reactionFor === msg.id && (
                  <div
                    ref={emojiRef}
                    className={`fixed top-1/2 -translate-y-1/2 ${
                      isMine ? 'right-0' : 'left-0'
                    } z-50`}
                  >
                    <EmojiPicker
                      reactionsDefaultOpen={true}
                      emojiStyle="facebook"
                      previewConfig={{ showPreview: false }}
                      theme="dark"
                      skinTonesDisabled
                      onEmojiClick={e => {
                        handleReact(msg.id, e.emoji);
                        handCLickOutside(e);
                        setReactionFor(null);
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {typing[userId] && (
            <div ref={bottomRef} className="flex justify-start mb-2">
              <Comment
                visible={true}
                height="80"
                width="80"
                ariaLabel="comment-loading"
                wrapperStyle={{}}
                wrapperClass="comment-wrapper"
                color="#fff"
                backgroundColor="#be29ec"
              />
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {isRecording ? (
          <div className="w-[95%] mx-auto px-4 py-3 bg-blue-500 text-white flex items-center gap-4 rounded-xl">
            <button
              className="bg-red-500 text-white w-7.5 h-7.5 rounded-full flex items-center justify-center cursor-pointer"
              onClick={stopRecording}
            >
              <IoIosCloseCircleOutline size={24} />
            </button>

            <span className="font-semibold text-sm">
              {formatTime(recordTime)}
            </span>

            <div className="flex-1">
              <LiveWaveform analyser={analyser} />
            </div>

            <button
              onClick={handleSendRecording}
              className="bg-white text-blue-500 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
              <Send size={24} />
            </button>
          </div>
        ) : HeBlockMe[userId] ? (
          <div>
            <div className="w-full mx-auto px-4 py-3 bg-gray-400/30 text-white flex items-center justify-center rounded-b-xl">
              <span className="font-semibold text-sm">
                This user going to fly, don't disturb!
              </span>
            </div>
          </div>
        ) : IBlockHim[userId] ? (
          <div className="w-full mx-auto px-4 py-3 bg-gray-400/30 text-white flex items-center justify-center rounded-b-xl">
            <div className="flex flex-col items-center gap-1.5">
              <button className="text-[14px] font-inter font-medium text-white bg-purple-500 rounded-md py-2 px-4 cursor-pointer">
                Unblock
              </button>
              <p>It's just message block you can unblock this user anytime.</p>
            </div>
          </div>
        ) : (
          <NormalChatUI
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            startRecording={startRecording}
            attachments={attachments}
            setAttachments={setAttachments}
            chatUserId={userId}
          />
        )}

        {blockMenu && (
          <BlockMenu
            setBlockMenu={setBlockMenu}
            userId={userId}
            isBlocked={iBlocked}
            onBlock={() => setIBlockHim(prev => ({ ...prev, [userId]: true }))}
            onUnblock={() =>
              setIBlockHim(prev => ({ ...prev, [userId]: false }))
            }
          />
        )}
      </div>
      {active && (
        <SeeProfileFicture
          src={activePicture}
          onClose={() => setActive(false)}
        />
      )}
    </>
  );
}
