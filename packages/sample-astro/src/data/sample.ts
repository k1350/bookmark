export const DATA = Array.from({ length: 30 }).map((_, i) => {
  return { id: i, content: `これはサンプル本文です。${i + 1}行目` };
});
