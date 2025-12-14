'use client';

import { Mic, Paperclip, Send, SmileIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const NormalChatUI = ({ input, setInput, sendMessage, startRecording }) => {
  const textareaRef = useRef(null);
  const [hasWrapped, setHasWrapped] = useState(false);
  let isTyping = input.trim().length > 0;

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

    if (!isTyping) {
      setHasWrapped(false);
      el.style.height = '45px';
      return;
    }

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
  }, [input, hasWrapped, isTyping]);

  return (
    <div className="w-full px-4 py-3 border-t bg-transparent flex items-center gap-3">
      {!isTyping && (
        <>
          <button
            onMouseDown={startRecording}
            className="bg-purple-600 w-10 h-10 flex items-center justify-center rounded-full"
          >
            <Mic className="text-white" />
          </button>
          <Paperclip className="cursor-pointer" />
        </>
      )}

      <textarea
        ref={textareaRef}
        placeholder="Type Aa..."
        className={`flex-1 w-full h-[45px] resize-none bg-transparent outline-none border border-gray-300 px-4 font-open_sens text-white transition-all ${
          hasWrapped ? 'rounded-lg py-3' : 'rounded-full py-2'
        } ${isTyping ? 'w-full' : 'w-[55%]'} `}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
      />
      <SmileIcon size={28} className="cursor-pointer" />

      <button
        onClick={sendMessage}
        disabled={!isTyping}
        className={`bg-purple-600 ${
          !isTyping && 'opacity-50'
        } text-white px-4 py-2 rounded-full hover:bg-purple-700`}
      >
        <Send />
      </button>
    </div>
  );
};

export default NormalChatUI;

// 'use client';

// import { Mic, Paperclip, Send, SmileIcon } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';

// const NormalChatUI = ({ input, setInput, sendMessage, startRecording }) => {
//   const textareaRef = useRef(null);
//   const [hasWrapped, setHasWrapped] = useState(false);

//   const isTyping = input.trim().length > 0;

//   useEffect(() => {
//     const el = textareaRef.current;
//     if (!el) return;

//     if (!isTyping) {
//       setHasWrapped(false);
//       el.style.height = '45px';
//       return;
//     }

//     el.style.height = '45px';
//     el.style.height = el.scrollHeight + 2 + 'px';

//     if (!hasWrapped && el.scrollHeight > 45) {
//       setHasWrapped(true);
//     }
//   }, [input, isTyping, hasWrapped]);

//   return (
//     <div className="w-full px-4 py-3 border-t bg-transparent flex items-center gap-3">
//       {!isTyping && (
//         <>
//           <SmileIcon className="cursor-pointer text-white" />
//           <Paperclip className="cursor-pointer text-white" />
//         </>
//       )}

//       <textarea
//         ref={textareaRef}
//         placeholder="Type Aa..."
//         className={`transition-all duration-200 resize-none bg-transparent outline-none border border-gray-300 px-4 font-open_sens text-white
//           ${hasWrapped ? 'rounded-lg py-3' : 'rounded-full py-2'}
//           ${isTyping ? 'flex-1 w-full' : 'w-[55%]'}
//         `}
//         value={input}
//         onChange={e => setInput(e.target.value)}
//         onKeyDown={e => {
//           if (e.key === 'Enter' && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//           }
//         }}
//       />

//       {!isTyping && (
//         <button
//           onMouseDown={startRecording}
//           className="bg-gray-300 p-2 rounded-full"
//         >
//           <Mic className="text-black" />
//         </button>
//       )}

//       {isTyping && (
//         <button
//           onClick={sendMessage}
//           className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-700 transition"
//         >
//           <Send size={18} />
//         </button>
//       )}
//     </div>
//   );
// };

// export default NormalChatUI;
