'use client';

import { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, Send } from 'lucide-react';
import useScrollToBottom from '@/customHook/useScrollToBottom';
import NormalChatUI from './NormalChatUI';
import LiveWaveform from './LiveWaveform';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import AudioPlayer from './AudioPlayer';
import { useGraphQL } from './Hook/useGraphQL';
import twemoji from 'twemoji';
import { uploadToCloudinary } from '@/lib/cloudinaryClient';
import SeeProfileFicture from './SeeProfileFicture';

export default function Message({
  chatUserId,
  conversationId,
  userInfo,
  currentUser,
}) {
  let { request, loading, error } = useGraphQL();
  let [messages, setMessages] = useState([]);

  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef(null);
  const [analyser, setAnalyser] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [active, setActive] = useState(false);
  const [activePicture, setActivePicture] = useState(null);
  const audioChunksRef = useRef([]);

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
      if (!conversationId) {
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
          receiverId: chatUserId,
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
      console.log(data);
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
        if (!conversationId) return;
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
        const data = await request(query, { conversationId });
        if (data.getMessages) setMessages(data.getMessages);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMessages();
  }, [conversationId, request]);

  return (
    <>
      <div className="h-[94vh]  backdrop-blur-md bg-transparent border rounded-xl shadow-md mx-auto w-5xl flex flex-col">
        <div className="w-full px-5 py-4 border-b bg-transparent flex justify-between items-center rounded-t-lg">
          <div className="flex items-center gap-2">
            <img
              className="w-15 h-15 object-cover bg-center rounded-full"
              src={userInfo?.avatar || 'defult.png'}
              alt="group"
            />
            <div>
              <h2 className="font-semibold text-[18px] font-open_sens">
                {userInfo?.name || 'User'}
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

        <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3 ">
          {messages.map((msg, idx) => {
            const isMine = msg.sender.id === currentUser;

            const bgClass =
              msg.type === 'text' || msg.type === 'link'
                ? isMine
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white text-gray-600 rounded-bl-none'
                : '';
            return (
              <div
                key={idx}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[60%] px-4 py-2.5 rounded-xl flex items-center gap-2 ${
                    bgClass
                  }`}
                >
                  {msg.type === 'image' && msg.mediaUrl ? (
                    <img
                      src={msg.mediaUrl}
                      alt="attachment"
                      onClick={() => {
                        setActivePicture(msg.mediaUrl);
                        setActive(true);
                      }}
                      className="max-w-100 rounded-lg"
                    />
                  ) : msg.type === 'video' && msg.mediaUrl ? (
                    <video
                      src={msg.mediaUrl}
                      controls
                      className="max-w-100 rounded-lg"
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

            <button
              onClick={handleSendRecording}
              className="bg-white text-blue-500 w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
            >
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
