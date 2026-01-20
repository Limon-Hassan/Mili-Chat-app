'use client';

import { useState, useRef, useEffect } from 'react';
import { Phone, Video, MoreVertical, Send } from 'lucide-react';
import useScrollToBottom from '@/customHook/useScrollToBottom';
import NormalChatUI from './NormalChatUI';
import LiveWaveform from './LiveWaveform';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import AudioPlayer from './AudioPlayer';
import { useGraphQL } from './Hook/useGraphQL';

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

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      let mutation;
      let variables;
      if (!conversationId) {
        mutation = `
        mutation SendFirst($receiverId: ID!, $text: String!) {
          sendMessage(receiverId: $receiverId, text: $text, type: "text") {
            id
            text
            sender { id name avatar }
            conversation { id }
            createdAt
          }
        }
      `;
        variables = { receiverId: chatUserId, text: input.trim() };
      } else {
        mutation = `
        mutation SendStrict($conversationId: ID!, $text: String!) {
          sendMessageStrict(conversationId: $conversationId, text: $text, type: "text") {
            id
            text
            sender { id name avatar }
            createdAt
          }
        }
      `;
        variables = { conversationId, text: input.trim() };
      }
      let data = await request(mutation, variables);
      const messageData = data.sendMessage || data.sendMessageStrict;

      setMessages(prev => [...prev, messageData]);
      setInput('');
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
        let query = `query GetMessages($conversationId: ID!) {getMessages(conversationId: $conversationId) {id text createdAt
    sender {
      id
      name
      avatar
    }}}`;

        const data = await request(query, { conversationId });
        if (data.getMessages) setMessages(data.getMessages);
      } catch (error) {
        console.log(error);
      }
    };

    FetchMessages();
  }, [conversationId, request]);

  // msg input ta besi boro , grup chat setup , moblie ar jonno kora baki

  return (
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
          return (
            <div
              key={idx}
              className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[60%] px-4 py-2.5 rounded-xl flex items-center gap-2 ${
                  isMine
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-white text-gray-600 rounded-bl-none'
                }`}
              >
                {msg.type === 'audio' ? (
                  <AudioPlayer src={msg.audio} />
                ) : (
                  <span className="text-sm leading-5 font-normal font-open_sens ">
                    {msg.text}
                  </span>
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
            {recordTime < 10 ? `00:0${recordTime}` : `00:${recordTime}`}
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
        />
      )}
    </div>
  );
}
