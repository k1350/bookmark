import { getBookmarks } from "@k1350/novel-bookmark";
import { useBookmarks } from "../../hooks/useBookmarks";
import { BookmarkList } from "../BookmarkList";

type Props = {
  title: string;
};

export function ListPage({ title }: Props) {
  const { bookmarks, setBookmarks } = useBookmarks();

  return (
    <article>
      <h1>{title}</h1>
      {!bookmarks ? (
        <p>読み込み中</p>
      ) : bookmarks.length > 0 ? (
        <BookmarkList
          bookmarks={bookmarks}
          onRemoveBookmark={() => {
            getBookmarks().then((bookmarks) => {
              setBookmarks(bookmarks);
            });
          }}
        />
      ) : (
        <p>ブックマークはありません</p>
      )}
    </article>
  );
}
