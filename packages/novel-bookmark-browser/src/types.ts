type BookmarkButtonProps = {
  /**
   * ブックマーク済みのときのブックマークボタンのテキスト
   * @default "Remove Bookmark"
   */
  bookmarkedText?: string;
  /**
   * ブックマークしていないときのブックマークボタンのテキスト
   * @default "Add Bookmark"
   */
  notBookmarkedText?: string;
};

export type CreateBookmarkButtonProps = BookmarkButtonProps & {
  /**
   * ボタン押下後に実行する追加処理
   */
  onClick?: () => void;
};

export type updateBookmarkButtonProps = BookmarkButtonProps & {
  element: HTMLButtonElement;
};

type BookmarkListProps = {
  /**
   * ブックマークが存在しないときのテキスト
   * @default "No bookmarks"
   */
  noBookmarkText?: string;
  /**
   * ブックマーク削除ボタンのテキスト
   * @default "Remove"
   */
  removeBookmarkButtonText?: string;
  /**
   * ブックマーク削除ボタン押下時の処理
   */
  onClickRemoveBookmarkButton?: () => void;
};

export type CreateBookmarkListProps = BookmarkListProps;

export type UpdateBookmarkListProps = BookmarkListProps & {
  element: HTMLDivElement;
};

export type CreateListProps = CreateBookmarkListProps & {
  parentElement: HTMLElement;
  className?: string;
};

export type CreateButtonProps = CreateBookmarkButtonProps & {
  parentElement: HTMLElement;
  className?: string;
};

export type CreateButtonAndListProps = {
  buttonProps: CreateButtonProps & { className: string };
  listProps: CreateListProps & { className: string };
};

export type OnClickRemoveBookmarkButtonProps = BookmarkButtonProps & {
  buttonClassName: string;
};
