import { isBookmarked } from "novel-bookmark/index.js";

type Props = {
  element: HTMLElement;
};

/**
 * ブックマークボタンのdata属性を更新する
 */
export async function updateBookmarkButton({
  element,
}: Props): Promise<HTMLElement> {
  const bookmarked = await isBookmarked(window.location.href);
  element.dataset.bookmarked = bookmarked ? "true" : "false";
  return element;
}
