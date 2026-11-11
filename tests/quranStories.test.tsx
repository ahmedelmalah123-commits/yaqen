import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
  QURAN_STORIES_PLAYLIST,
  STORY_CATEGORIES,
  buildYouTubeEmbedUrl,
  quranStoriesData,
} from '../src/lib/data/quranStoriesData';
import QuranStories from '../src/pages/QuranStories';

describe('Quran Stories (قصص الإنسان والنساء والحيوان في القرآن)', () => {
  it('stores exact verified playlist data without invented episodes or duplicates', () => {
    expect(QURAN_STORIES_PLAYLIST.id).toBe('PLSDc2nCH-1IJ5B50itQixOFNYGGhephu8');
    expect(quranStoriesData).toHaveLength(88);
    expect(STORY_CATEGORIES).toHaveLength(3);

    const byCat = {
      human: quranStoriesData.filter((e) => e.category === 'human'),
      women: quranStoriesData.filter((e) => e.category === 'women'),
      animals: quranStoriesData.filter((e) => e.category === 'animals'),
    };
    expect(byCat.human).toHaveLength(28);
    expect(byCat.women).toHaveLength(30);
    expect(byCat.animals).toHaveLength(30);

    // Human stories playlist skips episodes 28 and 29 at the YouTube source — must never fabricate them
    expect(byCat.human.some((e) => e.episodeNumber === 28 || e.episodeNumber === 29)).toBe(false);
    expect(byCat.human.some((e) => e.episodeNumber === 30)).toBe(true);

    const uniqueVideoIds = new Set(quranStoriesData.map((e) => e.videoId));
    expect(uniqueVideoIds.size).toBe(88);

    for (const ep of quranStoriesData) {
      expect(ep.videoId).toMatch(/^[A-Za-z0-9_-]{11}$/);
      expect(ep.rawTitle.length).toBeGreaterThan(10);
      expect(buildYouTubeEmbedUrl(ep.videoId)).toBe(
        `https://www.youtube-nocookie.com/embed/${ep.videoId}?rel=0&modestbranding=1`
      );
    }
  });

  it('filters by category and Arabic search and updates YouTube embed when selecting an episode', () => {
    render(
      <MemoryRouter initialEntries={['/stories']}>
        <QuranStories />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'قصص الإنسان والنساء والحيوان في القرآن' })).toBeInTheDocument();

    const iframe = document.querySelector('iframe') as HTMLIFrameElement;
    expect(iframe).not.toBeNull();
    expect(iframe.title).toBe(quranStoriesData[0].rawTitle);
    expect(iframe.src).toContain(`youtube-nocookie.com/embed/${quranStoriesData[0].videoId}`);

    fireEvent.click(screen.getByRole('tab', { name: /قصص الحيوان في القرآن/ }));
    expect(screen.getByText(/المعروض: ٣٠ حلقة/)).toBeInTheDocument();

    const searchInput = screen.getByLabelText('ابحث في قصص القرآن');
    fireEvent.change(searchInput, { target: { value: 'الهدهد' } });

    const hudhudBtn = screen.getByText('هدهد سليمان - ج 1').closest('button');
    expect(hudhudBtn).not.toBeNull();
    if (hudhudBtn) {
      hudhudBtn.scrollIntoView = () => {};
      fireEvent.click(hudhudBtn);
    }

    const updatedFrame = document.querySelector('iframe') as HTMLIFrameElement;
    expect(updatedFrame).not.toBeNull();
    expect(updatedFrame.src).toContain('youtube-nocookie.com/embed/');
  });
});
