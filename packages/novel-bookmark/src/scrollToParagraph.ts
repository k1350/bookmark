import { NOVEL_BOOKMARK_P_DATA_NAME } from "./constants";
import { getParagraphIdFromStorage } from "./storage";

/** sessionStorage に保存してあるパラグラフまでスクロールする */
export function scrollToParagraph(): void {
  const id = getParagraphIdFromStorage();
  if (!id) return;
  const element = document.querySelector(
    `[${NOVEL_BOOKMARK_P_DATA_NAME}="${id}"]`,
  );
  if (!element) {
    return;
  }
  element.scrollIntoView({ behavior: "smooth" });
}
