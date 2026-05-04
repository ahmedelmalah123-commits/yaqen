import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStoryStore } from '../store/useStoryStore';
import StoryText from '../components/Story/StoryText';
import AudioWavePlayer from '../components/Story/AudioWavePlayer';
import { ArrowLeft, BookOpen, Headphones } from 'lucide-react';
import AmBarakaAssistant from '../components/AI/AmBarakaAssistant';

export default function StoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentStory, fetchStoryById, isLoading } = useStoryStore();
  const [mode, setMode] = useState('immersive'); // reading, listening, immersive

  useEffect(() => {
    if (id) {
      fetchStoryById(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isLoading || !currentStory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary dark:bg-[#0A1A14]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-accent border-t-transparent animate-spin"></div>
          <p className="text-primary font-tajawal">جاري تحميل القصة...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-[#0A1A14] text-primary pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#0f1c2c]/80 backdrop-blur-md border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-black/5 rounded-full transition">
          <ArrowLeft size={24} className="text-primary dark:text-accent" />
        </button>
        <h1 className="font-tajawal font-bold text-xl">{currentStory.title}</h1>
        <div className="flex gap-2 bg-black/5 dark:bg-white/10 p-1 rounded-xl">
          <button 
            onClick={() => setMode('reading')}
            className={`p-2 rounded-lg transition ${mode === 'reading' ? 'bg-white dark:bg-[#0f1c2c] shadow-sm text-accent' : ''}`}
          >
            <BookOpen size={20} />
          </button>
          <button 
            onClick={() => setMode('immersive')}
            className={`p-2 rounded-lg transition ${mode === 'immersive' ? 'bg-white dark:bg-[#0f1c2c] shadow-sm text-accent' : ''}`}
          >
            <Headphones size={20} />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-8">
        {mode !== 'listening' && (
          <StoryText content={currentStory.content} images={currentStory.images} />
        )}
      </main>

      {/* Fixed Footer Player */}
      {mode !== 'reading' && (
        <div className="fixed bottom-0 left-0 w-full p-4 z-50">
          <div className="max-w-3xl mx-auto">
            <AudioWavePlayer 
              audioUrl={currentStory.audio_url} 
              timestamps={currentStory.timestamps} 
              storyId={currentStory.id}
            />
          </div>
        </div>
      )}

      {/* AI Assistant */}
      <AmBarakaAssistant storyContext={currentStory} />
    </div>
  );
}
