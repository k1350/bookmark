import { NOVEL_BOOKMARK_P_ID_PREFIX } from "./constants";

type Props = {
  /**
   * 小説本文の探索対象となる親要素のクラス
   */
  wrapperClass: string;
  /**
   *  一文ごとに囲むタグ
   * @default "p"
   */
  paragraphTag?: string;
};
export function observe({
  paragraphTag = "p",
  ...props
}: Props): (() => void) | null {
  const io = setIdAndIntersectionObserver({
    ...props,
    paragraphTag,
  });
  if (!io) {
    return null;
  }
  return () => io.disconnect();
}

/** 探索対象内のすべての p タグに data-novel-bookmark-id を付与し、交差判定する */
function setIdAndIntersectionObserver({
  wrapperClass,
  paragraphTag,
}: Required<Props>): IntersectionObserver | null {
  const wrapperElements = document.getElementsByClassName(wrapperClass);
  if (wrapperElements.length === 0) {
    return null;
  }
  const element = wrapperElements[0];
  const paragraphs = element.getElementsByTagName(paragraphTag);

  for (let index = 0; index < paragraphs.length; index++) {
    const id = `${NOVEL_BOOKMARK_P_ID_PREFIX}${index}`;
    (paragraphs[index] as HTMLElement).dataset.novelBookmarkId = id;
  }

  // 一つの IntersectionObserver インスタンスで複数要素を監視する
  const intersectionObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      const target = entry.target as HTMLElement;
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
