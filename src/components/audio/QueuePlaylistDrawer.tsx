\import React, { useState } from 'react';
import {
  ListMusic,
  Trash2,
  ChevronUp,
  ChevronDown,
  Play,
  X,
  BookmarkPlus,
  FolderHeart,
  Plus,
} from 'lucide-react';
import { useAudioStore, QueuedTrack } from '../../store/useAudioStore';

export const QueuePlaylistDrawer: React.FC = () => {
  const isQueueDrawerOpen = useAudioStore((s) => s.isQueueDrawerOpen);
  const setQueueDrawerOpen = useAudioStore((s) => s.setQueueDrawerOpen);
  const queue = useAudioStore((s) => s.queue);
  const savedPlaylists = useAudioStore((s) => s.savedPlaylists);

  const removeQueueItem = useAudioStore((s) => s.removeQueueItem);
  const reorderQueue = useAudioStore((s) => s.reorderQueue);
  const clearQueue = useAudioStore((s) => s.clearQueue);
  const playNextFromQueue = useAudioStore((s) => s.playNextFromQueue);
  const saveCurrentQueueAsPlaylist = useAudioStore((s) => s.saveCurrentQueueAsPlaylist);
  const loadSavedPlaylist = useAudioStore((s) => s.loadSavedPlaylist);
  const deleteSavedPlaylist = useAudioStore((s) => s.deleteSavedPlaylist);

  const [activeTab, setActiveTab] = useState<'queue' | 'playlists'>('queue');
  const [playlistTitle, setPlaylistTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!isQueueDrawerOpen) return null;

  const handleSavePlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistTitle.trim() || queue.length === 0) return;
    saveCurrentQueueAsPlaylist(playlistTitle.trim());
    setPlaylistTitle('');
    setIsSaving(false);
    setActiveTab('playlists');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="قائمة الانتظار وقوائم التشغيل"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={() => setQueueDrawerOpen(false)}
      dir="rtl"
    >
      <div
        className="w-full max-w-md h-full bg-stage border-r border-[var(--border-tactile)] p-5 flex flex-col gap-4 shadow-2xl overflow-y-auto font-tajawal text-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border-tactile)]">
          <div className="flex items-center gap-2">
            <ListMusic size={20} className="text-glow" />
            <h3 className="text-lg font-black font-cairo">قائمة الانتظار والتلاوات</h3>
          </div>
          <button
            type="button"
            onClick={() => setQueueDrawerOpen(false)}
            className="w-9 h-9 rounded-full tactile-pill flex items-center justify-center text-ink-muted hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-recessed text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`py-2 rounded-xl transition-all ${activeTab === 'queue'
                ? 'tactile-pill text-glow font-black shadow-sm'
                : 'text-ink-secondary hover:text-ink'
              }`}
          >
            قائمة الانتظار ({queue.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('playlists')}
            className={`py-2 rounded-xl transition-all ${activeTab === 'playlists'
                ? 'tactile-pill text-glow font-black shadow-sm'
                : 'text-ink-secondary hover:text-ink'
              }`}
          >
            قوائمي المحفوظة ({savedPlaylists.length})
          </button>
        </div>

        {/* Queue Tab Content */}
        {activeTab === 'queue' && (
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
            {/* Queue Actions */}
            {queue.length > 0 && (
              <div className="flex items-center justify-between gap-2 pb-1">
                <button
                  type="button"
                  onClick={() => setIsSaving(true)}
                  className="flex items-center gap-1.5 text-xs text-glow hover:underline font-bold"
                >
                  <BookmarkPlus size={14} />
                  <span>حفظ كقائمة تشغيل</span>
                </button>
                <button
                  type="button"
                  onClick={clearQueue}
                  className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold"
                >
                  <Trash2 size={13} />
                  <span>إفراغ القائمة</span>
                </button>
              </div>
            )}

            {/* Save Playlist Form */}
            {isSaving && (
              <form onSubmit={handleSavePlaylist} className="p-3 rounded-2xl bg-recessed flex flex-col gap-2">
                <label className="text-xs font-bold text-ink">اسم القائمة:</label>
                <input
                  type="text"
                  value={playlistTitle}
                  onChange={(e) => setPlaylistTitle(e.target.value)}
                  placeholder="مثال: ورد الفجر مع الحصري..."
                  className="p-2 rounded-xl bg-stage border border-[var(--border-tactile)] text-xs text-ink focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  autoFocus
                />
                <div className="flex justify-end gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setIsSaving(false)}
                    className="px-3 py-1.5 rounded-xl text-xs text-ink-muted hover:text-ink"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-emerald-500 text-black text-xs font-bold"
                  >
                    حفظ القائمة
                  </button>
                </div>
              </form>
            )}

            {/* Track Items */}
            {queue.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center text-ink-muted gap-2">
                <ListMusic size={32} className="opacity-40" />
                <p className="text-xs font-semibold">قائمة الانتظار فارغة حالياً.</p>
                <p className="text-[11px] text-ink-muted">
                  يمكنك إضافة أي سورة لقائمة الانتظار من صفحة المصحف أو القراء لتستمع إليها بالتتابع.
                </p>
              </div>
            ) : (
              queue.map((item, index) => (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-stage border border-[var(--border-tactile)] flex items-center justify-between gap-2 hover:border-emerald-500/40 transition-colors"
                >
                  <span className="w-5 text-center text-xs font-mono font-bold text-ink-muted">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs sm:text-sm font-black font-cairo truncate text-ink">
                      {item.label}
                    </h4>
                    <p className="text-[11px] text-ink-secondary truncate">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Reorder and Delete controls */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderQueue(index, index - 1)}
                      title="تحريك لأعلى"
                      className="p-1 rounded hover:bg-recessed text-ink-muted hover:text-ink disabled:opacity-30"
                    >
                      <ChevronUp size={15} />
                    </button>
                    <button
                      type="button"
                      disabled={index === queue.length - 1}
                      onClick={() => reorderQueue(index, index + 1)}
                      title="تحريك لأسفل"
                      className="p-1 rounded hover:bg-recessed text-ink-muted hover:text-ink disabled:opacity-30"
                    >
                      <ChevronDown size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeQueueItem(item.id)}
                      title="حذف من القائمة"
                      className="p-1 rounded hover:bg-red-500/10 text-ink-muted hover:text-red-400"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Playlists Tab Content */}
        {activeTab === 'playlists' && (
          <div className="flex-1 flex flex-col gap-3 overflow-y-auto no-scrollbar">
            {savedPlaylists.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center text-ink-muted gap-2">
                <FolderHeart size={32} className="opacity-40" />
                <p className="text-xs font-semibold">لا توجد قوائم تشغيل محفوظة.</p>
                <p className="text-[11px] text-ink-muted">
                  رتّب السور في قائمة الانتظار واضغط على "حفظ كقائمة تشغيل" لتعود إليها بنقرة واحدة.
                </p>
              </div>
            ) : (
              savedPlaylists.map((pl) => (
                <div
                  key={pl.id}
                  className="p-3.5 rounded-2xl bg-stage border border-[var(--border-tactile)] flex items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm font-black font-cairo truncate text-ink">
                      {pl.title}
                    </h4>
                    <p className="text-[11px] text-ink-secondary">
                      {pl.tracks.length} تلاوات · {new Date(pl.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        loadSavedPlaylist(pl.id);
                        setQueueDrawerOpen(false);
                      }}
                      title="تشغيل القائمة"
                      className="p-2 rounded-xl tactile-pill text-emerald-500 hover:text-emerald-400 active:scale-95"
                    >
                      <Play size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteSavedPlaylist(pl.id)}
                      title="حذف القائمة"
                      className="p-2 rounded-xl hover:bg-red-500/10 text-ink-muted hover:text-red-400 active:scale-95"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QueuePlaylistDrawer;

