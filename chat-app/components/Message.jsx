'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Phone,
  Video,
  MoreVertical,
  Send,
  Smile,
  Paperclip,
} from 'lucide-react';
import useScrollToBottom from '@/customHook/useScrollToBottom';

export default function Message() {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordTime, setRecordTime] = useState(0);
  const timerRef = useRef(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    setAudioChunks([]);
    setRecordTime(0);

    recorder.ondataavailable = e => setAudioChunks(prev => [...prev, e.data]);

    recorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      setMessages(prev => [
        ...prev,
        { id: Date.now(), text: audioUrl, sender: 'me', type: 'audio' },
      ]);
      clearInterval(timerRef.current);
      setRecordTime(0);
    };

    recorder.start();
    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setRecordTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current);
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
    <div className="h-[94vh] w-full bg-transparent border rounded-xl shadow-md mx-auto max-w-5xl flex flex-col">
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

      <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
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
                  : 'bg-gray-200 text-black rounded-bl-none'
              }`}
            >
              {msg.type === 'audio' ? (
                <audio controls src={msg.text} className="w-full rounded" />
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

      <div className="w-full px-4 py-3 border-t bg-transparent flex items-center gap-3">
        <Smile className="cursor-pointer" size={22} />
        <Paperclip className="cursor-pointer" size={22} />

        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          className={`px-3 py-2 rounded-full ${
            isRecording ? 'bg-red-500' : 'bg-gray-300'
          }`}
        >
          {isRecording ? 'Recording...' : '🎤'}
        </button>

        {isRecording ? (
          <div className="flex-1 flex items-center justify-center text-sm font-medium text-red-600">
            Recording: {recordTime}s
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
        )}

        {!isRecording && (
          <button
            onClick={sendMessage}
            className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
          >
            <Send size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
