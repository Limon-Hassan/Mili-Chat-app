'use client';

import { Mic, Paperclip, Send, SmileIcon } from 'lucide-react';
import { useRef, useState } from 'react';

const NormalChatUI = ({ input, setInput, sendMessage, startRecording }) => {
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  const handleInput = e => {
    const el = textareaRef.current;
    setInput(e.target.value);

    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };
  return (
    <div className="w-full px-4 py-3 border-t bg-transparent flex items-center gap-3">
      <SmileIcon className="cursor-pointer" />
      <Paperclip className="cursor-pointer" />

      <textarea
        ref={textareaRef}
        placeholder="Type a message..."
        className={`flex-1 border px-4 py-2 focus:outline-none resize-none overflow-hidden
          ${input.includes('\n') ? 'rounded-lg' : 'rounded-full'}`}
        value={input}
        onChange={handleInput}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        rows={1}
      />

      <button
        onMouseDown={startRecording}
        className="bg-gray-300 px-4 py-2 rounded-full"
      >
        <Mic className="text-black" />
      </button>

      <button
        onClick={sendMessage}
        className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700"
      >
        <Send />
      </button>
    </div>
  );
};

export default NormalChatUI;
