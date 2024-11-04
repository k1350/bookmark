import { createBookmarkButton } from "./inner/createBookmarkButton";
import type { CreateButtonProps } from "./types";

export async function createButton({
  parentElement,
  className,
  ...props
}: CreateButtonProps) {
  const button = await createBookmarkButton(props);
  if (className) {
    button.classList.add(className);
  }
  parentElement.appendChild(button);
  return button;
}
