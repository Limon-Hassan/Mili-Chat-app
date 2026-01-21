'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  MoreVertical,
  Cross,
  Send,
  StopCircle,
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

export default function page() {
  let router = useRouter();
  let { request, loading, error } = useGraphQL();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  const avatar = searchParams.get('avatar');
  const conversationId = searchParams.get('conversationId');

  let [conversation, setConversation] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  let [messages, setMessages] = useState([]);
  let [me, setMe] = useState({});

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const [attachments, setAttachments] = useState([]);
  const [active, setActive] = useState(false);
  const [activePicture, setActivePicture] = useState(null);
  const timerRef = useRef(null);
  const audioChunksRef = useRef([]);



  const [analyser, setAnalyser] = useState(null);

  const startRecording = async () => {
    setIsRecording(true);
    setRecordTime(0);

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


  const [input, setInput] = useState('');

  const bottomRef = useScrollToBottom([messages]);

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
    setActiveConversation(validConversation || null);
  }, [conversationId, conversation]);

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

  const sendMessage = async () => {
    if (!input.trim() && attachments.length === 0) return;
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
      let mutation;
      let variables;
      if (!activeConversation) {
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
            conversation { id }
            createdAt
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
            createdAt
          }
        }
      `;

        let firstAttachment = uploadedAttachments[0];
        variables = {
          conversationId,
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
        if (!activeConversation.id) return;
        let query = `query GetMessages($conversationId: ID!) {
  getMessages(conversationId: $conversationId) {
    id
    text
    mediaUrl
    type
    duration
    createdAt
    sender { id name avatar }
    receiver { id name avatar }
  }
}`;

        const data = await request(query, {
          conversationId: activeConversation.id,
        });
        if (data.getMessages) setMessages(data.getMessages);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMessages();
  }, [activeConversation]);

  useEffect(() => {
    let fetchMe = async () => {
      try {
        const query = `query { me { id name avatar } }`;
        const data = await request(query);
        setMe(data.me);
      } catch (err) {
        console.log(err);
      }
    };
    fetchMe();
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 w-full flex flex-col backdrop-blur-md bg-transparent border shadow-md mx-auto max-w-5xl"
        style={{ height: 'var(--app-height)' }}
      >
        <div className="w-full px-5 py-4 border-b bg-transparent flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-2">
            <img
              className="w-15 h-15 object-cover bg-center rounded-full"
              src={avatar || '/defult.png'}
              alt="group"
            />
            <div>
              <h2 className="font-semibold text-[18px] font-open_sens">
                {name}
              </h2>
              <p className="text-[13px] font-bold text-green-600">Online</p>
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
                className="absolute top-8 right-0 bg-black shadow-xl rounded-md w-45 py-2 border"
              >
                <p className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer">
                  Block User
                </p>
                <p className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer">
                  Theme
                </p>
                <p className="px-4 py-2 hover:bg-gray-100 hover:text-black cursor-pointer">
                  Clear Chat
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-3">
          {messages.map(msg => {
            const isMine = msg.sender.id === me?.id;

            const bgClass =
              msg.type === 'text' || msg.type === 'link'
                ? isMine
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white text-gray-600 rounded-bl-none'
                : '';
            return (
              <div
                key={msg.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[60%] px-4 py-2.5 rounded-xl flex items-center gap-2 ${bgClass}`}
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
                          className: 'w-5 h-5 inline',
                        }),
                      }}
                    ></span>
                  )}
                </div>
              </div>
            );
          })}
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

            <button className="bg-white text-blue-500 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer">
              <Send size={24} />
            </button>
          </div>
        ) : (
          <NormalChatUI
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            startRecording={startRecording}
            attachments={attachments}
            setAttachments={setAttachments}
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
