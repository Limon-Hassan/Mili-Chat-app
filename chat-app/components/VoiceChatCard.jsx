'use client';

import React from 'react';

const VoiceChatCard = ({ audioSrc }) => {
  return (
    <div className="voice-chat-card border rounded-lg p-2 bg-purple-600 shadow-md w-75 mx-auto">
      <div className="voice-chat-card-body flex flex-col h-15">
        <div className="text-white text-lg font-semibold"> Own Voice</div>
        <div className="audio-container">
          <audio controls className="w-full">
            <source src={audioSrc.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
        </div>
      </div>
    </div>
  );
};

export default VoiceChatCard;
