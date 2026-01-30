import React, { useState, useRef, useEffect } from 'react';

export default function VoiceRecorder({ onSave = () => {} }) {
  const [isRecording, setIsRecording] = useState(false);
  const [bars, setBars] = useState(new Array(20).fill(20));
  const [tempAudio, setTempAudio] = useState(null);
  const [recordings, setRecordings] = useState([]);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const rafRef = useRef(null);
  const streamRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = e =>
        chunksRef.current.push(e.data);

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setTempAudio({ url, blob });
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      audioContextRef.current = new AudioContext();
      await audioContextRef.current.resume();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 1024;

      source.connect(analyserRef.current);

      const animateBars = () => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.fftSize;
        const dataArray = new Uint8Array(bufferLength);

        analyserRef.current.getByteTimeDomainData(dataArray);

        const sliceSize = Math.floor(bufferLength / 20);
        const heights = [];

        for (let i = 0; i < 20; i++) {
          const slice = dataArray.slice(i * sliceSize, (i + 1) * sliceSize);

          const avg =
            slice.reduce((sum, v) => sum + Math.abs(v - 128), 0) / slice.length;

          heights.push(Math.min(48, Math.max(6, avg)));
        }

        setBars(heights);
        rafRef.current = requestAnimationFrame(animateBars);
      };

      animateBars();
    } catch (e) {
      alert('Microphone blocked!');
    }
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    if (audioContextRef.current) audioContextRef.current.close();
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    analyserRef.current = null;

    streamRef.current?.getTracks().forEach(t => t.stop());

    setBars(new Array(20).fill(6));
  };

  const saveRecording = () => {
    if (tempAudio) {
      setRecordings(prev => [...prev, tempAudio]);
      setTempAudio(null);
      onSave(tempAudio.blob);
    }
  };

  const discardRecording = () => {
    setTempAudio(null);
  };

  const deleteRecording = idx => {
    setRecordings(r => r.filter((_, i) => i !== idx));
  };

  return (
    <div className="p-6 flex flex-col items-center gap-6">
      {isRecording && (
        <div className="flex gap-2 h-24 items-end bg-gray-200 p-4 text-black rounded-lg shadow-inner">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-2 bg-purple-600 rounded"
              style={{
                height: `${h}px`,
                transition: 'height 0.08s ease-out',
              }}
            />
          ))}
        </div>
      )}

      {!isRecording && !tempAudio && (
        <button
          onClick={startRecording}
          className="px-6 py-3 rounded bg-purple-600 text-[16px] font-semibold font-inter text-white"
        >
          Start Recording
        </button>
      )}

      {isRecording && (
        <button
          onClick={stopRecording}
          className="px-6 py-3 rounded bg-red-600 text-white"
        >
          Stop
        </button>
      )}

      {tempAudio && (
        <div className="flex gap-4">
          <button
            onClick={saveRecording}
            className="px-5 py-2 bg-green-600 text-white rounded"
          >
            Add
          </button>
          <button
            onClick={discardRecording}
            className="px-5 py-2 bg-gray-400 text-black rounded"
          >
            Discard
          </button>
        </div>
      )}

      {recordings.length > 0 && (
        <div className="w-full mt-6">
          <h3 className="text-lg font-semibold mb-3">Saved Recordings</h3>

          {recordings.map((rec, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-gray-100 p-3 rounded mb-2"
            >
              <audio src={rec.url} controls />

              <button
                onClick={() => deleteRecording(idx)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
