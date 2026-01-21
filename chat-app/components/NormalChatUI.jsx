'use client';

import EmojiPicker from 'emoji-picker-react';
import { Mic, Paperclip, Send, SmileIcon, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const NormalChatUI = ({
  input,
  setInput,
  sendMessage,
  startRecording,
  attachments,
  setAttachments,
}) => {
  const textareaRef = useRef(null);
  const fileRef = useRef(null);
  const [hasWrapped, setHasWrapped] = useState(false);
  const [Emoji, setEmoji] = useState(false);
  let isTyping = input.trim().length > 0;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    if (!isTyping || input === '') {
      setHasWrapped(false);
      el.style.height = '45px';
      return;
    }

    el.style.height = '45px';

    el.style.height = Math.min(el.scrollHeight + 2, 120) + 'px';

    if (!hasWrapped && (el.scrollHeight > 45 || input.length >= 90)) {
      setHasWrapped(true);
    }
  }, [input, hasWrapped, isTyping]);

  const handleFileChange = e => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setAttachments(prev => {
      const remainingSlots = 6 - prev.length;
      if (remainingSlots <= 0) return prev;

      const limitedFiles = files.slice(0, remainingSlots);

      const newAttachments = limitedFiles.map(file => ({
        file,
        type: file.type.startsWith('image') ? 'image' : 'video',
        previewUrl: URL.createObjectURL(file),
      }));

      return [...prev, ...newAttachments];
    });

    e.target.value = '';
  };

  const insertEmojiAtCursor = emoji => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const newText = input.slice(0, start) + emoji + input.slice(end);

    setInput(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + emoji.length, start + emoji.length);
    }, 0);
  };

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
          <Paperclip
            onClick={() => fileRef.current.click()}
            className="cursor-pointer"
          />
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            hidden
            onChange={handleFileChange}
          />
        </>
      )}

      <div className="flex-1  bg-transparent">
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-2 flex-wrap">
            {attachments.map((att, index) => (
              <div key={index} className="relative w-14 h-14   ">
                {att.type === 'image' ? (
                  <img
                    src={att.previewUrl}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={att.previewUrl}
                    className="w-full h-full object-cover rounded-lg"
                  />
                )}

                <button
                  onClick={() =>
                    setAttachments(prev => prev.filter((_, i) => i !== index))
                  }
                  className="absolute -top-1 -right-1 bg-black text-white w-5 h-5 rounded-full text-xs flex items-center justify-center "
                >
                  <X />
                </button>
              </div>
            ))}

            {attachments.length < 6 && (
              <button
                onClick={() => fileRef.current.click()}
                className="w-14 h-14 border border-dashed rounded-lg flex items-center justify-center text-white"
              >
                +
              </button>
            )}
          </div>
        )}

        <textarea
          ref={textareaRef}
          placeholder="Type Aa..."
          className={`flex-1 w-full h-11.25 resize-none bg-transparent outline-none border border-gray-300 px-4 font-open_sens text-white transition-all whitespace-pre-wrap overflow-break-word overrflow-y-scroll ${
            hasWrapped ? 'rounded-lg py-3' : 'rounded-full py-2'
          } ${isTyping ? 'w-full' : 'w-[55%]'} `}
          value={input}
          style={{ maxHeight: '120px', height: '45px' }}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
      </div>

      <div className="relative">
        <SmileIcon
          onClick={() => setEmoji(!Emoji)}
          size={28}
          className="cursor-pointer"
        />

        {Emoji && (
          <div className="absolute bottom-12 right-0 z-50">
            <EmojiPicker
              theme="dark"
              emojiStyle="facebook"
              skinTonesDisabled={true}
              previewConfig={{ showPreview: false }}
              className="mobile:w-70! mobile:h-95! computer:w-80! computer:h-105! emoji-picker"
              onEmojiClick={emojiData => {
                insertEmojiAtCursor(emojiData.emoji);
              }}
            />
          </div>
        )}
      </div>

      <button
        onClick={sendMessage}
        disabled={!(isTyping || attachments.length > 0)}
        className={`bg-purple-600 ${
          !(isTyping || attachments.length > 0) ? 'opacity-50' : ''
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

{
  /* <textarea
        ref={textareaRef}
        placeholder="Type Aa..."
        className={`flex-1 w-full h-11.25 resize-none bg-transparent outline-none border border-gray-300 px-4 font-open_sens text-white transition-all ${
          hasWrapped ? 'rounded-lg py-3' : 'rounded-full py-2'
        } ${isTyping ? 'w-full' : 'w-[55%]'} `}
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
      /> */
}

// useEffect(() => {
//   const el = textareaRef.current;
//   if (!el) return;

//   if (!isTyping) {
//     setHasWrapped(false);
//     el.style.height = '45px';
//     return;
//   }

//   if (input === '') {
//     setHasWrapped(false);
//     el.style.height = '45px';
//     return;
//   }

//   el.style.height = '45px';
//   el.style.height = el.scrollHeight + 2 + 'px';

//   if (!hasWrapped && (el.scrollHeight > 45 || input.length >= 90)) {
//     setHasWrapped(true);
//   }
// }, [input, hasWrapped, isTyping]);
