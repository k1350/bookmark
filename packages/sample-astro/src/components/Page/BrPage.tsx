import { DATA } from "../../data/sample";
import { useBookmarked } from "../../hooks/useBookmarked";
import { useObserve } from "../../hooks/useObserve";
import { BookmarkButton } from "../BookmarkButton";
import { BrNovel } from "../Novel/BrNovel";
import styles from "./index.module.css";

type Props = {
  title: string;
};

export function BrPage({ title }: Props) {
  const { bookmarked, setBookmarked } = useBookmarked();
  useObserve();

  return (
    <article className={styles.PageContainer}>
      <h1>{title}</h1>
      <BrNovel data={DATA} />
      {bookmarked !== undefined && (
        <BookmarkButton bookmarked={bookmarked} setBookmarked={setBookmarked} />
      )}
    </article>
  );
}
