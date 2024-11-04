import { createButton } from "./createButton";
import { createList } from "./createList";
import { updateBookmarkButton } from "./inner/updateBookmarkButton";
import { updateBookmarkList } from "./inner/updateBookmarkList";
import type {
  CreateButtonAndListProps,
  OnClickRemoveBookmarkButtonProps,
} from "./types";

export async function createButtonAndList({
  buttonProps,
  listProps,
}: CreateButtonAndListProps) {
  const button = await createButton({
    ...buttonProps,
    onClick: () => onClickBookmarkButton({ buttonProps, listProps }),
  });
  const list = await createList({
    ...listProps,
    onClickRemoveBookmarkButton: () =>
      onClickRemoveBookmarkButton({
        buttonClassName: buttonProps.className,
        ...buttonProps,
      }),
  });
  return { button, list };
}

function onClickBookmarkButton({
  buttonProps: { className: buttonClassName, ...buttonProps },
  listProps: { className: listClassName, ...listProps },
}: CreateButtonAndListProps) {
  const bookmarkList = document.querySelector(`.${listClassName}`);
  if (bookmarkList instanceof HTMLDivElement) {
    updateBookmarkList({
      element: bookmarkList,
      ...listProps,
      onClickRemoveBookmarkButton: () => {
        const bookmarkButton = document.querySelector(`.${buttonClassName}`);
        if (bookmarkButton instanceof HTMLButtonElement) {
          updateBookmarkButton({
            element: bookmarkButton,
            ...buttonProps,
          });
        }
      },
    });
  }
}

function onClickRemoveBookmarkButton({
  buttonClassName,
  ...props
}: OnClickRemoveBookmarkButtonProps) {
  const bookmarkButton = document.querySelector(`.${buttonClassName}`);
  if (bookmarkButton instanceof HTMLButtonElement) {
    updateBookmarkButton({
      element: bookmarkButton,
      ...props,
    });
  }
}
