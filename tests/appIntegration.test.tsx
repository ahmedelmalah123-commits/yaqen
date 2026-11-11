import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppStore, DEFAULT_READING_SETTINGS } from '../src/store/useAppStore';
import {
  useAudioStore,
  getAllowedRepeatModes,
  normalizeRepeatMode,
} from '../src/store/useAudioStore';
import { toggleBookmark, getBookmarks } from '../src/lib/bookmarks';
import Radio from '../src/pages/Radio';
import NotFound from '../src/pages/NotFound';
import Surah from '../src/pages/Surah';
import GlobalAudioPlayer from '../src/components/audio/GlobalAudioPlayer';

function mockSurah1Api(withTiming: boolean) {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
    const url = String(input);
    if (url.endsWith('/surah/1/quran-uthmani')) {
      return new Response(
        JSON.stringify({
          code: 200,
          data: {
            number: 1,
            name: 'سُورَةُ ٱلْفَاتِحَةِ',
            englishName: 'Al-Faatiha',
            englishNameTranslation: 'The Opening',
            numberOfAyahs: 2,
            revelationType: 'Meccan',
            ayahs: [
              {
                number: 1,
                numberInSurah: 1,
                text: 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
                juz: 1,
                manzil: 1,
                page: 1,
                ruku: 1,
                hizbQuarter: 1,
                sajda: false,
              },
              {
                number: 2,
                numberInSurah: 2,
                text: 'ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ',
                juz: 1,
                manzil: 1,
                page: 1,
                ruku: 1,
                hizbQuarter: 1,
                sajda: false,
              },
            ],
          },
        }),
        { status: 200 }
      );
    }
    if (url.endsWith('/surah/1/ar.muyassar')) {
      return new Response(
        JSON.stringify({
          code: 200,
          data: {
            ayahs: [
              { numberInSurah: 1, text: 'تفسير الفاتحة ١' },
              { numberInSurah: 2, text: 'تفسير الفاتحة ٢' },
            ],
          },
        }),
        { status: 200 }
      );
    }
    if (url.includes('mp3quran.net/api/v3/ayat_timing')) {
      return new Response(
        JSON.stringify(
          withTiming
            ? [
                { ayah: 1, start_time: 1000, end_time: 5000 },
                { ayah: 2, start_time: 5000, end_time: 10000 },
              ]
            : []
        ),
        { status: 200 }
      );
    }
    throw new Error(`Unexpected URL: ${url}`);
  });
}

describe('Yaqeen platform core integration contracts', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({
      theme: 'light',
      ...DEFAULT_READING_SETTINGS,
      reciter: 'ar.alafasy',
    });
    useAudioStore.getState().stop();
    useAudioStore.getState().clearQueue();
    useAudioStore.setState({ lastSession: null, savedPlayback: null, repeatMode: 'none' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('defaults theme to Warm Cream light mode and resets reading preferences', () => {
    const store = useAppStore.getState();
    expect(store.theme).toBe('light');
    store.setQuranFontSize(48);
    store.setReadingSurface('paper');
    store.resetReadingSettings();
    expect(useAppStore.getState().quranFontSize).toBe(32);
    expect(useAppStore.getState().readingSurface).toBe('auto');
  });

  it('preserves bookmarks localStorage contract', () => {
    const saved = toggleBookmark({
      surah_id: 2,
      surah_name: 'البقرة',
      ayah_num: 255,
      ayah_text: 'ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ',
    });
    expect(saved).toBe(true);
    expect(getBookmarks()).toHaveLength(1);
    const removed = toggleBookmark({ surah_id: 2, ayah_num: 255 });
    expect(removed).toBe(false);
    expect(getBookmarks()).toHaveLength(0);
  });

  it('displays Medina unavailable status transparently on /radio and hides repeat for live radio', () => {
    render(
      <MemoryRouter>
        <Radio />
        <GlobalAudioPlayer />
      </MemoryRouter>
    );

    expect(screen.getByText('إذاعة السنة النبوية (المدينة)')).toBeInTheDocument();
    expect(screen.getByText(/البث متوقف حالياً من المصدر الخارجي/i)).toBeInTheDocument();

    const cairoBtn = screen.getByText('إذاعة القرآن الكريم (القاهرة)').closest('button');
    expect(cairoBtn).not.toBeNull();
    if (cairoBtn) fireEvent.click(cairoBtn);

    expect(useAudioStore.getState().source?.kind).toBe('radio');
    expect(useAudioStore.getState().repeatMode).toBe('none');

    fireEvent.click(screen.getByLabelText('توسيع المشغل'));
    expect(screen.queryByLabelText('تبديل وضع التكرار')).not.toBeInTheDocument();
  });

  it('restricts repeat modes and supports prev/next surah transport for full-surah playback', () => {
    expect(getAllowedRepeatModes({ kind: 'radio', stationId: '1', stationName: 'r', stationType: 't', streamUrl: 'https://x' })).toEqual(['none']);
    expect(getAllowedRepeatModes({ kind: 'surah-stream', surahNumber: 1, surahName: 'الفاتحة', reciterId: 'ar.alafasy', reciterName: 'العفاسي', streamUrl: 'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/001.mp3', totalAyahs: 7 })).toEqual(['none', 'surah']);
    expect(normalizeRepeatMode('ayah', 'surah-stream')).toBe('none');

    useAudioStore.getState().playSurahStream({
      surahNumber: 18,
      surahName: 'الكهف',
      reciterId: 'ar.khalifaaltunaiji',
      reciterName: 'خليفة الطنيجي',
      streamUrl: 'https://cdn.mp3quran.net/audio/khalifa-tunaiji/r1/018.mp3',
      totalAyahs: 110,
    });

    render(
      <MemoryRouter>
        <GlobalAudioPlayer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('توسيع المشغل'));
    const repeatBtn = screen.getByLabelText('تبديل وضع التكرار');
    expect(repeatBtn).toHaveTextContent('بلا تكرار');
    fireEvent.click(repeatBtn);
    expect(repeatBtn).toHaveTextContent('تكرار السورة');
    fireEvent.click(repeatBtn);
    expect(repeatBtn).toHaveTextContent('بلا تكرار');

    fireEvent.click(screen.getByLabelText('السورة التالية'));
    const afterNext = useAudioStore.getState().source;
    expect(afterNext?.kind).toBe('surah-stream');
    if (afterNext?.kind === 'surah-stream') {
      expect(afterNext.surahNumber).toBe(19);
      expect(afterNext.streamUrl).toContain('/019.mp3');
    }

    fireEvent.click(screen.getByLabelText('السورة السابقة'));
    const afterPrev = useAudioStore.getState().source;
    if (afterPrev?.kind === 'surah-stream') {
      expect(afterPrev.surahNumber).toBe(18);
      expect(afterPrev.streamUrl).toContain('/018.mp3');
    }
  });

  it('highlights the selected sleep timer preset duration and persists timestamp distinct from ayah bookmark', () => {
    useAudioStore.getState().playSurahStream({
      surahNumber: 18,
      surahName: 'الكهف',
      reciterId: 'ar.khalifaaltunaiji',
      reciterName: 'خليفة الطنيجي',
      streamUrl: 'https://cdn.mp3quran.net/audio/khalifa-tunaiji/r1/018.mp3',
      totalAyahs: 110,
    });
    useAudioStore.getState().persistPlaybackProgress(42, 600);

    render(
      <MemoryRouter>
        <GlobalAudioPlayer />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByLabelText('توسيع المشغل'));
    const thirtyBtn = screen.getByRole('button', { name: '٣٠د' });
    const stopTimerBtn = screen.getByRole('button', { name: 'إيقاف' });
    expect(thirtyBtn).toHaveAttribute('aria-pressed', 'false');
    expect(stopTimerBtn).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(thirtyBtn);
    expect(thirtyBtn).toHaveAttribute('aria-pressed', 'true');
    expect(thirtyBtn.className).toContain('active-ayah-glow');
    expect(stopTimerBtn).toHaveAttribute('aria-pressed', 'false');

    const stored = JSON.parse(localStorage.getItem('yaqeen-audio-storage') || '{}');
    expect(stored.state.savedPlayback.currentTime).toBe(42);
    expect(stored.state.lastSession.ayahNumber).toBe(1);
  });

  it('syncs ayah highlight + seek with validated timing and cleanly disables per-ayah sync when unavailable', async () => {
    useAppStore.setState({ reciter: 'ar.hussary_mujawwad_rare' });
    mockSurah1Api(true);

    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    const { unmount } = render(
      <QueryClientProvider client={qc}>
        <MemoryRouter initialEntries={['/surah/1']}>
          <Routes>
            <Route path="/surah/:id" element={<Surah />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const enqueueBtn = await screen.findByLabelText('إضافة السورة كاملة إلى قائمة الانتظار');
    fireEvent.click(enqueueBtn);

    await waitFor(() => expect(useAudioStore.getState().queue).toHaveLength(1));
    const queued = useAudioStore.getState().queue[0];
    expect(queued.subtitle).toBe('الحصري (مجوّد)');
    expect(queued.source.kind).toBe('surah-stream');
    if (queued.source.kind === 'surah-stream') {
      expect(queued.source.streamUrl).toBe('https://cdn.mp3quran.net/audio/mahmoud-husary/r2/001.mp3');
      expect(queued.source.streamUrl).not.toContain('ar.alafasy');
    }

    // Select Ayah 2 and click play from ayah -> starts full-surah stream seeked to 5.0s
    fireEvent.click(screen.getByLabelText('الآية 2'));
    const playFromAyahBtn = screen.getByRole('button', { name: /تشغيل من الآية/ });
    expect(playFromAyahBtn).toBeEnabled();
    fireEvent.click(playFromAyahBtn);

    const s = useAudioStore.getState();
    expect(s.source?.kind).toBe('surah-stream');
    expect(s.pendingRestoreTime).toBe(5);
    expect(s.currentTime).toBe(5);

    act(() => {
      useAudioStore.getState().clearPendingRestoreTime();
      useAudioStore.getState().setRuntimeState({ status: 'playing', currentTime: 6.2 });
    });
    expect(screen.getByLabelText('الآية 2').className).toContain('active-ayah-glow');

    unmount();
    vi.restoreAllMocks();

    // Untimed reciter: ar.mahermuaiqly -> full-surah works, per-ayah seek disabled gracefully
    useAudioStore.getState().stop();
    useAppStore.setState({ reciter: 'ar.mahermuaiqly' });
    mockSurah1Api(false);

    const qc2 = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc2}>
        <MemoryRouter initialEntries={['/surah/1']}>
          <Routes>
            <Route path="/surah/:id" element={<Surah />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const unavailableBtn = await screen.findByRole('button', { name: /التوقيت غير متاح/ });
    expect(unavailableBtn).toBeDisabled();
    expect(screen.getByText(/ومزامنة التظليل أو البدء من آية محددة غير متوفرين لهذا القارئ/)).toBeInTheDocument();
  });

  it('renders NotFound 404 screen cleanly', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByText('الصفحة غير موجودة')).toBeInTheDocument();
    expect(screen.getByText('العودة للرئيسية')).toBeInTheDocument();
  });
});
