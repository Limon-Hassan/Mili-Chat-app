'use client';

import { Mic, Paperclip, Send, SmileIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const NormalChatUI = ({ input, setInput, sendMessage, startRecording }) => {
  const textareaRef = useRef(null);
  const [hasWrapped, setHasWrapped] = useState(false);

  // const handleInput = e => {
  //   setInput(e.target.value);

  //   let height = textareaRef.current;
  //   height.style.height = 45 + 'px';
  //   let point = (height.style.height = height.scrollHeight + 2 + 'px');
  //   if (point > 45) {
  //     setHasWrapped(true);
  //   }
  //   if (e.target.value.length >= 90) {
  //     setHasWrapped(true);
  //     height.style.height = height.scrollHeight + 2 + 'px';
  //   } else {
  //     setHasWrapped(false);
  //   }
  // };

  // const handleInput = e => {
  //   setInput(e.target.value);

  //   const el = textareaRef.current;

  //   el.style.height = '45px';
  //   el.style.height = el.scrollHeight + 2 + 'px';

  //   if (!hasWrapped && (el.scrollHeight > 45 || e.target.value.length >= 90)) {
  //     setHasWrapped(true);
  //   }
  // };

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    if (input === '') {
      setHasWrapped(false);
      el.style.height = '45px';
      return;
    }

    el.style.height = '45px';
    el.style.height = el.scrollHeight + 2 + 'px';

    if (!hasWrapped && (el.scrollHeight > 45 || input.length >= 90)) {
      setHasWrapped(true);
    }
  }, [input, hasWrapped]);

  return (
    <div className="w-full px-4 py-3 border-t bg-transparent flex items-center gap-3">
      <SmileIcon className="cursor-pointer" />
      <Paperclip className="cursor-pointer" />

      <textarea
        ref={textareaRef}
        placeholder="Type Aa..."
        className={`flex-1 w-full h-[45px] resize-none bg-transparent outline-none border border-gray-300 px-4 font-open_sens text-white transition-all duration-150 ${
          hasWrapped ? 'rounded-lg py-3' : 'rounded-full py-2'
        }`}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
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
