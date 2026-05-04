import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { mockStories } from '../lib/data/mockStories';

export const useStoryStore = create((set, get) => ({
  stories: [],
  currentStory: null,
  activeParagraphId: null,
  isLoading: false,
  error: null,

  fetchStories: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('stories').select('*');
      if (error || !data || data.length === 0) {
        // Fallback to mock data if not set up
        set({ stories: mockStories, isLoading: false });
      } else {
        set({ stories: data, isLoading: false });
      }
    } catch (err) {
      set({ stories: mockStories, isLoading: false });
    }
  },

  fetchStoryById: async (id) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('stories').select('*').eq('id', id).single();
      if (error || !data) {
        const fallback = mockStories.find(s => s.id === id);
        set({ currentStory: fallback || null, isLoading: false });
      } else {
        set({ currentStory: data, isLoading: false });
      }
    } catch (err) {
      const fallback = mockStories.find(s => s.id === id);
      set({ currentStory: fallback || null, isLoading: false });
    }
  },

  setActiveParagraphId: (id) => set({ activeParagraphId: id }),

  saveProgress: async (userId, storyId, paragraphId, time) => {
    if (!userId) {
      // Guest mode
      localStorage.setItem(`progress_${storyId}`, JSON.stringify({ paragraphId, time }));
      return;
    }
    // Update supabase
    try {
      await supabase.from('progress').upsert({
        user_id: userId,
        story_id: storyId,
        last_position: time
      }, { onConflict: 'user_id, story_id' });
    } catch (e) {
      console.error(e);
    }
  },

  getProgress: async (userId, storyId) => {
    if (!userId) {
      const local = localStorage.getItem(`progress_${storyId}`);
      return local ? JSON.parse(local) : null;
    }
    const { data } = await supabase.from('progress').select('*').eq('user_id', userId).eq('story_id', storyId).single();
    return data;
  }
}));
