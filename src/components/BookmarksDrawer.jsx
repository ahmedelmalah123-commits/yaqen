import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { X, Bookmark, Trash2, ArrowUpLeft } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { getBookmarks, removeBookmark, BOOKMARKS_EVENT } from '../lib/bookmarks';

const BookmarksDrawer = () => {
  const { bookmarksDrawerOpen, setBookmarksDrawerOpen } = useAppStore();
  const [bookmarks, setBookmarks] = useState(() => getBookmarks());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => setBookmarks(getBookmarks());
    window.addEventListener(BOOKMARKS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(BOOKMARKS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    if (bookmarksDrawerOpen) {
      setBookmarks(getBookmarks());
    }
  }, [bookmarksDrawerOpen]);

  const handleGoToAyah = (b) => {
    setBookmarksDrawerOpen(false);
    navigate(`/surah/${b.surah_id}`, {
      state: { highlightAyahIndex: Math.max(0, Number(b.ayah_num) - 1) },
    });
  };

  return (
    <AnimatePresence>
      {bookmarksDrawerOpen && (
        <div
          className="fixed inset-0 z-[950] flex items-center justify-center p-4 bg-black/50 backdrop-blur-md font-tajawal"
          dir="rtl"
          onClick={() => setBookmarksDrawerOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl max-h-[82vh] flex flex-col overflow-hidden tactile-card p-5 sm:p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-[var(--glass-border-subtle)]">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full tactile-pill flex items-center justify-center text-glow">
                  <Bookmark size={18} fill="currentColor" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-ink font-cairo">
                    محفوظاتي القرآنية
                  </h2>
                  <p className="text-xs text-ink-secondary">
                    {bookmarks.length.toLocaleString('ar-EG')} آية محفوظة للرجوع السريع
                  </p>
                </div>
              </div>

              <button
                onClick={() => setBookmarksDrawerOpen(false)}
                className="w-10 h-10 rounded-full tactile-pill flex items-center justify-center text-ink-secondary hover:text-ink"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 no-scrollbar">
              {bookmarks.length === 0 ? (
                <div className="recessed-box p-10 text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-full tactile-pill flex items-center justify-center text-ink-muted">
                    <Bookmark size={24} />
                  </div>
                  <p className="text-base font-bold text-ink">لا توجد آيات محفوظة بعد</p>
                  <p className="text-xs sm:text-sm text-ink-secondary max-w-xs leading-relaxed">
                    اضغط على أيقونة الحفظ بجانب أي آية أثناء القراءة أو الاستماع لإضافتها هنا.
                  </p>
                </div>
              ) : (
                bookmarks.map((b, idx) => (
                  <div
                    key={`${b.surah_id}-${b.ayah_num}-${idx}`}
                    className="recessed-box p-4 flex flex-col gap-3 transition-all hover:border-glow-border"
                  >
                    <p className="font-uthmanic text-xl sm:text-2xl leading-[2.1] text-ink text-right">
                      {b.ayah_text}
                    </p>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[var(--glass-border-subtle)]">
                      <span className="tactile-pill px-3 py-1 text-xs font-bold text-ink-secondary">
                        سورة {b.surah_name} · الآية {Number(b.ayah_num).toLocaleString('ar-EG')}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeBookmark(b.surah_id, b.ayah_num)}
                          className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted hover:text-red-500 transition-colors"
                          title="حذف من المحفوظات"
                        >
                          <Trash2 size={15} />
                        </button>
                        <button
                          onClick={() => handleGoToAyah(b)}
                          className="tactile-pill px-3.5 py-1.5 text-xs font-bold text-ink flex items-center gap-1.5 hover:text-glow transition-colors"
                        >
                          <span>انتقال للآية</span>
                          <ArrowUpLeft size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default BookmarksDrawer;
