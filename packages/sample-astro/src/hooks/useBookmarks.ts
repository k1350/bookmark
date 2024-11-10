import { type Bookmark, getBookmarks } from "@k1350/novel-bookmark";
import { useEffect, useState } from "preact/hooks";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>();
  useEffect(() => {
    async function init() {
      setBookmarks(await getBookmarks());
    }
    init();
  }, []);
  return { bookmarks, setBookmarks };
}
