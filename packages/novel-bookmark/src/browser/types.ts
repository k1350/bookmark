export type CreateBookmarkButtonProps = {
  /**
   * ブックマークボタンを追加する親要素
   * @default document.body
   */
  parentElement?: HTMLElement;
  /**
   * 作成したブックマークボタンに適用するクラス名
   * @default "NovelBookmarkButton"
   */
  className?: string;
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
  /**
   * ボタン押下後に実行する追加処理
   */
  onClick?: () => void;
};

export type CreateBookmarkListProps = {
  /**
   * ブックマーク一覧を追加する親要素
   * @default document.body
   */
  parentElement?: HTMLElement;
  /**
   * 作成したブックマーク一覧に適用するクラス名
   * @default "NovelBookmarkList"
   */
  className?: string;
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
   * ブックマークしていないときのブックマークボタンのテキスト
   * @default "Add Bookmark"
   */
  notBookmarkedText?: string;
};
