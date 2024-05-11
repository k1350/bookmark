import type { Bookmark } from "./types";

const STORAGE_ID = "novel-bookmarks";
const TEMP_STORAGE_ID = "novel-bookmark-p-id";

type LocalStorageType = "local";
type SessionStorageType = "session";
type StorageType = LocalStorageType | SessionStorageType;

type SetItemToStorageProps = {
  type: StorageType;
  key: typeof STORAGE_ID | typeof TEMP_STORAGE_ID;
  value: string;
};
function setItemToStorage({ type, key, value }: SetItemToStorageProps) {
  if (type === "local") {
    return localStorage.setItem(key, value);
  }
  return sessionStorage.setItem(key, value);
}

type GetItemToStorageProps = {
  type: StorageType;
  key: typeof STORAGE_ID | typeof TEMP_STORAGE_ID;
};
function getItemFromStorage({
  type,
  key,
}: GetItemToStorageProps): string | null {
  if (type === "local") {
    return localStorage.getItem(key);
  }
  return sessionStorage.getItem(key);
}

type RemoveItemToStorageProps = {
  type: StorageType;
  key: typeof STORAGE_ID | typeof TEMP_STORAGE_ID;
};
function removeItemFromStorage({ type, key }: RemoveItemToStorageProps) {
  if (type === "local") {
    return localStorage.removeItem(key);
  }
  return sessionStorage.removeItem(key);
}

/** localStorage にブックマークを保存する */
export function setBookmarkToStorage(bookmarks: Bookmark[]) {
  setItemToStorage({
    type: "local",
    key: STORAGE_ID,
    value: JSON.stringify(bookmarks),
  });
}

/** sessionStorage にパラグラフID を保存する */
export function setParagraphIdToStorage(id: string) {
  setItemToStorage({ type: "session", key: TEMP_STORAGE_ID, value: id });
}

/** localStorage からブックマークを取得する */
export function getBookmarksFromStorage(): string | null {
  return getItemFromStorage({ type: "local", key: STORAGE_ID });
}

/** sessionStorage からパラグラフID を取得して削除する */
export function getParagraphIdFromStorage(): string | null {
  const id = getItemFromStorage({ type: "session", key: TEMP_STORAGE_ID });
  removeItemFromStorage({ type: "session", key: TEMP_STORAGE_ID });
  return id;
}

/** localStorage からブックマークを削除する */
export function removeBookmarkFromStorage() {
  removeItemFromStorage({ type: "local", key: STORAGE_ID });
}
