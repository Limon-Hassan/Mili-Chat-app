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

export default function page() {
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

  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'other' },
    { id: 2, text: 'I want to know about your services.', sender: 'me' },
    {
      id: 3,
      text: 'Sure! Tell me what exactly you are looking for.',
      sender: 'other',
    },
    {
      id: 4,
      text: 'Sure! Tell me what exactly you are looking for.',
      sender: 'other',
    },
    {
      id: 5,
      text: 'I want to know about your services. I want to know about your services I want to know about your services I want to know about your services I want to know about your services I want to know about your services',
      sender: 'me',
    },
    {
      id: 6,
      text: 'I want to know about your services. I want to know about your services I want to know about your services I want to know about your services I want to know about your services I want to know about your services',
      sender: 'me',
    },
    {
      id: 7,
      text: 'Sure! Tell me what exactly you are looking for. Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for',
      sender: 'other',
    },
    {
      id: 8,
      text: 'Sure! Tell me what exactly you are looking for. Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for',
      sender: 'other',
    },
    {
      id: 9,
      text: 'I want to know about your services. I want to know about your services I want to know about your services I want to know about your services I want to know about your services I want to know about your services',
      sender: 'me',
    },
    {
      id: 10,
      text: 'Sure! Tell me what exactly you are looking for. Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for Sure! Tell me what exactly you are looking for',
      sender: 'other',
    },
    { id: 11, text: 'I want to know about your services.', sender: 'me' },
    {
      id: 12,
      type: 'audio',
      audio: 'Sayfalse  Nulteex - AL NACER!.mp3',
      sender: 'me',
    },
  ]);

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

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'me' }]);
    setInput('');
  };

  return (
    <div className="h-screen w-full backdrop-blur-md bg-transparent border rounded-xl shadow-md mx-auto max-w-5xl flex flex-col">
      <div className="w-full px-5 py-4 border-b bg-transparent flex justify-between items-center rounded-t-lg">
        <div className="flex items-center gap-2">
          <img
            className="w-[60px] h-[60px] object-cover bg-center rounded-full"
            src="/Image.jpg"
            alt="group"
          />
          <div>
            <h2 className="font-semibold text-[18px] font-open_sens">
              Brother Limon
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
              className="absolute top-8 right-0 bg-black shadow-xl rounded-md w-[180px] py-2 border"
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
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === 'me' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[60%] px-4 py-2.5 rounded-xl flex items-center gap-2 ${
                msg.sender === 'me'
                  ? 'bg-purple-600 text-white rounded-br-none'
                  : 'bg-white text-gray-900 rounded-bl-none'
              }`}
            >
              {msg.type === 'audio' ? (
                <AudioPlayer src={msg.audio} />
              ) : (
                <span className="text-sm leading-5 font-normal font-open_sens">
                  {msg.text}
                </span>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {isRecording ? (
        <div className="w-[95%] mx-auto px-4 py-3 bg-blue-500 text-white flex items-center gap-4 rounded-xl">
          <button
            className="bg-red-500 text-white w-[30px] h-[30px] rounded-full flex items-center justify-center cursor-pointer"
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
