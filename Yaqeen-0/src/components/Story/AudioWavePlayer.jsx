import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { Play, Pause, FastForward, Rewind, Settings2 } from 'lucide-react';
import { useStoryStore } from '../../store/useStoryStore';

export default function AudioWavePlayer({ audioUrl, timestamps, storyId }) {
  const containerRef = useRef(null);
  const wavesurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const setActiveParagraphId = useStoryStore((state) => state.setActiveParagraphId);
  const saveProgress = useStoryStore((state) => state.saveProgress);

  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#d6a54a',
      progressColor: '#0f1c2c',
      cursorColor: '#0f1c2c',
      barWidth: 2,
      barGap: 3,
      barRadius: 2,
      height: 60,
      normalize: true,
    });

    wavesurferRef.current = ws;

    ws.load(audioUrl);

    ws.on('play', () => setIsPlaying(true));
    ws.on('pause', () => setIsPlaying(false));
    
    ws.on('timeupdate', (currentTime) => {
      // Find the active paragraph based on timestamps
      // timestamps format: [{ time: 0, id: 'p1' }, { time: 5, id: 'p2' }]
      let activeId = null;
      for (let i = timestamps.length - 1; i >= 0; i--) {
        if (currentTime >= timestamps[i].time) {
          activeId = timestamps[i].id;
          break;
        }
      }
      setActiveParagraphId(activeId);

      // Save progress occasionally (e.g. every 5 seconds)
      if (Math.floor(currentTime) % 5 === 0) {
        // mock userId = null for now over localstorage
        saveProgress(null, storyId, activeId, currentTime);
      }
    });

    return () => {
      ws.destroy();
    };
  }, [audioUrl, timestamps, storyId, saveProgress, setActiveParagraphId]);

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  const skipForward = () => {
    wavesurferRef.current?.skip(10);
  };

  const skipBackward = () => {
    wavesurferRef.current?.skip(-10);
  };

  const changeSpeed = () => {
    const nextRate = playbackRate === 1 ? 1.5 : playbackRate === 1.5 ? 2 : 1;
    setPlaybackRate(nextRate);
    wavesurferRef.current?.setPlaybackRate(nextRate);
  };

  return (
    <div className="bg-white/80 dark:bg-[#0f1c2c]/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-primary/10 flex flex-col gap-4">
      <div ref={containerRef} className="w-full"></div>
      
      <div className="flex items-center justify-between px-2">
        <button onClick={changeSpeed} className="text-sm font-semibold text-primary dark:text-accent w-12 py-1 px-2 rounded-lg bg-gray-100 dark:bg-black/20 hover:bg-gray-200 dark:hover:bg-black/40 transition">
          {playbackRate}x
        </button>

        <div className="flex items-center gap-6">
          <button onClick={skipBackward} className="text-primary dark:text-accent hover:scale-110 transition">
            <Rewind size={24} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center bg-primary dark:bg-accent text-white dark:text-primary rounded-full hover:scale-105 transition shadow-lg"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
          
          <button onClick={skipForward} className="text-primary dark:text-accent hover:scale-110 transition">
            <FastForward size={24} />
          </button>
        </div>

        <button className="text-primary dark:text-accent hover:scale-110 transition">
          <Settings2 size={24} />
        </button>
      </div>
    </div>
  );
}
