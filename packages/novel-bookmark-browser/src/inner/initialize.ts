import { observe, scrollToParagraph } from "novel-bookmark/index.js";
import { CONTAILNER_CLASS } from "../constants";

export function initialize() {
  const disconnect = observe({ wrapperClass: CONTAILNER_CLASS });
  if (!disconnect) return;
  scrollToParagraph();

  window.addEventListener("beforeunload", () => disconnect(), false);
}
