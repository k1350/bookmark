import { createBookmarkList } from "./inner/createBookmarkList";
import type { CreateListProps } from "./types";

export async function createList({
  parentElement,
  className,
  ...props
}: CreateListProps) {
  const element = await createBookmarkList(props);
  if (className) {
    element.classList.add(className);
  }
  parentElement.appendChild(element);
  return element;
}
