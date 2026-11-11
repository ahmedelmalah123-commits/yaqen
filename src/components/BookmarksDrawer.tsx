import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bookmark, Trash2, BookOpen, ArrowUpLeft, Search } from 'lucide-react';
import { SideDrawer } from './ui/OverlayPrimitives';
import { EmptyState } from './ui/StateViews';
import {
  getBookmarks,
  removeBookmark,
  BOOKMARKS_EVENT,
} from '../lib/bookmarks';
import { matchesNormalized, stripSurahPrefix, toArabicDigits } from '../lib/arabicSearch';

interface BookmarkEntry {
  surah_id: number;
  surah_name: string;
  ayah_num: number;
  ayah_text: string;
  saved_at?: string;
}

interface BookmarksDrawerProps {
  open: boolean;
  onClose: () => void;
}

const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkEntry[]>(() => getBookmarks());
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const sync = () => setBookmarks(getBookmarks());
    sync();
    window.addEventListener(BOOKMARKS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, [open]);

  const filtered = useMemo(() => {
    if (!filterText.trim()) return bookmarks;
    return bookmarks.filter(
      (item) =>
        matchesNormalized(item.surah_name || '', filterText) ||
        matchesNormalized(item.ayah_text || '', filterText)
    );
  }, [bookmarks, filterText]);

  const handleNavigate = (item: BookmarkEntry) => {
    onClose();
    navigate(`/surah/${item.surah_id}?ayah=${item.ayah_num}`, {
      state: { highlightAyahIndex: Math.max(0, Number(item.ayah_num) - 1) },
    });
  };

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="الآيات المحفوظة"
      subtitle={`${toArabicDigits(bookmarks.length)} آية محفوظة محلياً على جهازك`}
    >
      <div className="flex flex-col gap-4 font-tajawal">
        {bookmarks.length > 0 && (
          <div className="recessed-well px-3.5 py-2 flex items-center gap-2">
            <Search size={14} className="text-glow shrink-0" />
            <input
              type="text"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="ابحث داخل المحفوظات..."
              aria-label="ابحث داخل المحفوظات"
              className="flex-1 bg-transparent text-xs font-semibold text-ink outline-none placeholder:text-ink-muted"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Bookmark size={22} />}
            title={bookmarks.length === 0 ? 'لا توجد آيات محفوظة بعد' : 'لا توجد نتائج مطابقة'}
            description={
              bookmarks.length === 0
                ? 'اضغط على أي آية أثناء تصفح المصحف ثم اختر حفظ الآية لتصل إليها هنا في أي وقت.'
                : 'جرّب كلمة بحث مختلفة داخل محفوظاتك.'
            }
            action={
              bookmarks.length === 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/quran');
                  }}
                  className="tactile-pill px-4 py-2 text-xs font-bold text-ink hover:text-glow flex items-center gap-2"
                >
                  <BookOpen size={14} />
                  <span>فتح المصحف</span>
                </button>
              )
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <div
                key={`${item.surah_id}-${item.ayah_num}`}
                className="tactile-card p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="recessed-well px-3 py-1 text-[11px] font-bold text-glow">
                    سورة {stripSurahPrefix(item.surah_name)} · آية {toArabicDigits(item.ayah_num)}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeBookmark(item.surah_id, item.ayah_num)}
                    aria-label="إزالة الآية من المحفوظات"
                    title="إزالة"
                    className="w-8 h-8 rounded-full tactile-pill flex items-center justify-center text-ink-muted hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <p className="font-uthmanic text-xl leading-[2.1] text-ink text-right">
                  {item.ayah_text}
                </p>

                <button
                  type="button"
                  onClick={() => handleNavigate(item)}
                  className="tactile-pill px-4 py-2 text-xs font-bold text-ink hover:text-glow flex items-center justify-between gap-2"
                >
                  <span>الانتقال إلى الآية في المصحف</span>
                  <ArrowUpLeft size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </SideDrawer>
  );
};

export default BookmarksDrawer;

