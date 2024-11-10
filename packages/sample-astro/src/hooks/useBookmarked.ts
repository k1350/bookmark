import { isBookmarked } from "@k1350/novel-bookmark";
import { useEffect, useState } from "preact/hooks";

export function useBookmarked() {
  const [bookmarked, setBookmarked] = useState<boolean>();
  useEffect(() => {
    async function init() {
      setBookmarked(await isBookmarked(window.location.href));
    }
    init();
  }, []);

  return {
    bookmarked,
    setBookmarked,
  };
}
