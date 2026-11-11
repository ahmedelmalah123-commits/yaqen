const BOOKMARKS_KEY = 'yaqeen_bookmarks';
export const BOOKMARKS_EVENT = 'yaqeen-bookmarks-updated';

/**
 * Read all saved ayah bookmarks from localStorage safely.
 * @returns {Array<{surah_id: number, surah_name: string, ayah_num: number, ayah_text: string, saved_at: string}>}
 */
export function getBookmarks() {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBookmarks(list) {
  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(BOOKMARKS_EVENT, { detail: list }));
}

/**
 * Check whether a specific ayah is bookmarked.
 */
export function isAyahBookmarked(surahId, ayahNum) {
  return getBookmarks().some(
    (b) => Number(b.surah_id) === Number(surahId) && Number(b.ayah_num) === Number(ayahNum)
  );
}

/**
 * Add an ayah bookmark if not already present.
 */
export function addBookmark(entry) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some(
    (b) => Number(b.surah_id) === Number(entry.surah_id) && Number(b.ayah_num) === Number(entry.ayah_num)
  );
  if (!exists) {
    saveBookmarks([entry, ...bookmarks]);
  }
}

/**
 * Toggle an ayah bookmark on/off and return the new bookmarked boolean state.
 */
export function toggleBookmark(entry) {
  const bookmarks = getBookmarks();
  const exists = bookmarks.some(
    (b) => Number(b.surah_id) === Number(entry.surah_id) && Number(b.ayah_num) === Number(entry.ayah_num)
  );
  if (exists) {
    saveBookmarks(
      bookmarks.filter(
        (b) => !(Number(b.surah_id) === Number(entry.surah_id) && Number(b.ayah_num) === Number(entry.ayah_num))
      )
    );
    return false;
  }
  saveBookmarks([entry, ...bookmarks]);
  return true;
}

/**
 * Remove a bookmark by surah_id and ayah_num.
 */
export function removeBookmark(surahId, ayahNum) {
  const bookmarks = getBookmarks().filter(
    (b) => !(Number(b.surah_id) === Number(surahId) && Number(b.ayah_num) === Number(ayahNum))
  );
  saveBookmarks(bookmarks);
}
