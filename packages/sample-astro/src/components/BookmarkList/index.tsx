import {
  type Bookmark,
  onClickBookmarkLink,
  removeBookmark,
} from "@k1350/novel-bookmark";
import styles from "./index.module.scss";

type Props = {
  bookmarks: Bookmark[];
  onRemoveBookmark: () => void;
};
export function BookmarkList({ bookmarks, onRemoveBookmark }: Props) {
  return (
    <ul className={styles.BookmarkList}>
      {bookmarks.map((bookmark) => (
        <li key={bookmark.id} className={styles.BookmarkListItem}>
          <BookmarkLink bookmark={bookmark} />
          <button
            type="button"
            onClick={() => {
              removeBookmark(bookmark);
              onRemoveBookmark();
            }}
          >
            削除
          </button>
        </li>
      ))}
    </ul>
  );
}

type BookmarkLinkProps = {
  bookmark: Bookmark;
};
function BookmarkLink({ bookmark }: BookmarkLinkProps) {
  return (
    <a href={bookmark.url} onClick={() => onClickBookmarkLink(bookmark)}>
      {bookmark.title}
    </a>
  );
}
