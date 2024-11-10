import { observe, scrollToParagraph } from "novel-bookmark/index.js";
import { CONTAILNER_CLASS } from "../constants.js";

/**
 * ビューポート内にどの要素が表示されているかを監視し、指定の要素があればそこまでスクロールする
 */
export function initialize() {
  const disconnect = observe({ wrapperClass: CONTAILNER_CLASS });
  if (!disconnect) return;
  scrollToParagraph();

  window.addEventListener("beforeunload", () => disconnect(), false);
}
