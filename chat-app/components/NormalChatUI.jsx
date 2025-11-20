import { Mic, Mic2Icon, Paperclip, Send, SmileIcon } from 'lucide-react';

const NormalChatUI = ({ input, setInput, sendMessage, startRecording }) => {
  return (
    <div className="w-full px-4 py-3 border-t bg-transparent flex items-center gap-3">
      <SmileIcon className="cursor-pointer" />
      <Paperclip className="cursor-pointer" />

      <input
        type="text"
        placeholder="Type a message..."
        className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
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
