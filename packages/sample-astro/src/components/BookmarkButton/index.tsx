import {
  type Bookmark,
  addBookmark,
  getBookmarks,
  removeBookmark,
} from "@k1350/novel-bookmark";
import type { Dispatch, StateUpdater } from "preact/hooks";
import styles from "./index.module.css";

type Props = {
  bookmarked: boolean;
  setBookmarked: Dispatch<StateUpdater<boolean | undefined>>;
  setBookmarks?: Dispatch<StateUpdater<Bookmark[] | undefined>>;
};
export function BookmarkButton({
  bookmarked,
  setBookmarked,
  setBookmarks,
}: Props) {
  return (
    <button
      type="button"
      className={styles.BookmarkButton}
      onClick={() => {
        if (bookmarked) {
          removeBookmark(window.location.href).then(() => {
            if (setBookmarks) {
              getBookmarks().then((bookmarks) => {
                setBookmarks(bookmarks);
              });
            }
          });
        } else {
          addBookmark().then(() => {
            if (setBookmarks) {
              getBookmarks().then((bookmarks) => {
                setBookmarks(bookmarks);
              });
            }
          });
        }
        setBookmarked((prev) => !prev);
      }}
    >
      {bookmarked ? "ブックマーク解除" : "ブックマークする"}
    </button>
  );
}
