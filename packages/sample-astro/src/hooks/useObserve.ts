import { observe, scrollToParagraph } from "@k1350/novel-bookmark";
import { useEffect } from "preact/hooks";

export function useObserve() {
  useEffect(() => {
    const disconnect = observe({ wrapperClass: "Novel" });
    if (!disconnect) return;
    scrollToParagraph();

    return () => {
      disconnect();
    };
  }, []);
}
