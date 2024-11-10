import { getBookmarks, isBookmarked } from "@k1350/novel-bookmark";
import { DATA } from "../../data/sample";
import { useBookmarked } from "../../hooks/useBookmarked";
import { useBookmarks } from "../../hooks/useBookmarks";
import { useObserve } from "../../hooks/useObserve";
import { BookmarkButton } from "../BookmarkButton";
import { BookmarkList } from "../BookmarkList";
import { ParagraphNovel } from "../Novel/ParagraphNovel";
import styles from "./index.module.css";

type Props = {
  title: string;
};

export function ParagraphPage({ title }: Props) {
  const { bookmarked, setBookmarked } = useBookmarked();
  const { bookmarks, setBookmarks } = useBookmarks();
  useObserve();

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
        <ParagraphNovel data={DATA} />
        {bookmarked !== undefined && (
          <BookmarkButton
            bookmarked={bookmarked}
            setBookmarked={setBookmarked}
            setBookmarks={setBookmarks}
          />
        )}
      </article>
    </>
  );
}
