import { NOVEL_BOOKMARK_P_ID_PREFIX } from "./constants";

type Props = {
  /**
   * 小説本文の探索対象となる親要素のクラス
   */
  wrapperClass: string;
};
export function observe({ wrapperClass }: Props): (() => void) | null {
  const io = setIdAndIntersectionObserver({
    wrapperClass,
  });
  if (!io) {
    return null;
  }
  return () => io.disconnect();
}

/** 探索対象内のすべての p タグに data-novel-bookmark-id を付与し、交差判定する */
function setIdAndIntersectionObserver({
  wrapperClass,
}: Required<Props>): IntersectionObserver | null {
  const wrapperElements = document.getElementsByClassName(wrapperClass);
  if (wrapperElements.length === 0) {
    return null;
  }
  const element = wrapperElements[0];
  const paragraphs = element.children;

  for (let index = 0; index < paragraphs.length; index++) {
    const id = `${NOVEL_BOOKMARK_P_ID_PREFIX}${index}`;
    const paragraph = paragraphs[index];
    if (!(paragraph instanceof HTMLElement)) {
      continue;
    }
    paragraph.dataset.novelBookmarkId = id;
  }

  // 一つの IntersectionObserver インスタンスで複数要素を監視する
  const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target;
      if (!(target instanceof HTMLElement)) {
        continue;
      }
      const id = target.dataset.novelBookmarkId;
      if (!id) {
        continue;
      }
      target.dataset.novelBookmarkIntersecting =
        entry.isIntersecting.toString();
    }
  });
  for (const paragraph of paragraphs) {
    intersectionObserver.observe(paragraph);
  }
  return intersectionObserver;
}
