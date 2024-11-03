import {
  type Bookmark,
  addBookmark,
  getBookmarks,
  isBookmarked,
  observe,
  removeBookmark,
  scrollToParagraph,
} from "@k1350/novel-bookmark";
import { useEffect, useState } from "preact/hooks";
import { BookmarkList } from "../BookmarkList";
import styles from "./index.module.css";

type Props = {
  title: string;
};

export function Page({ title }: Props) {
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>();

  useEffect(() => {
    async function init() {
      setBookmarked(await isBookmarked(window.location.href));
      setBookmarks(await getBookmarks());
    }
    init();

    const disconnect = observe({ wrapperClass: "Novel" });
    if (!disconnect) return;
    scrollToParagraph();

    return () => {
      disconnect();
    };
  }, []);

  const data = Array.from({ length: 30 }).map((_, i) => {
    return { id: i, content: `これはサンプル本文です。${title}。${i + 1}行目` };
  });
  return (
    <>
      {bookmarks && bookmarks.length > 0 && (
        <BookmarkList
          bookmarks={bookmarks}
          onRemoveBookmark={() => {
            getBookmarks()
              .then((bookmarks) => {
                setBookmarks(bookmarks);
                return isBookmarked(window.location.href);
              })
              .then((bookmarked) => setBookmarked(bookmarked));
          }}
        />
      )}
      <article className={styles.PageContainer}>
        <h1>{title}</h1>
        <div className="Novel">
          {data.map((item) => (
            <p key={item.id} className={styles.NovelParagraph}>
              {item.content}
            </p>
          ))}
        </div>
        <button
          type="button"
          className={styles.BookmarkButton}
          onClick={() => {
            if (bookmarked) {
              removeBookmark(window.location.href)
                .then(() => {
                  return getBookmarks();
                })
                .then((bookmarks) => {
                  setBookmarks(bookmarks);
                });
            } else {
              addBookmark()
                .then(() => {
                  return getBookmarks();
                })
                .then((bookmarks) => {
                  setBookmarks(bookmarks);
                });
            }
            setBookmarked((prev) => !prev);
          }}
        >
          {bookmarked ? "ブックマーク解除" : "ブックマークする"}
        </button>
      </article>
    </>
  );
}
