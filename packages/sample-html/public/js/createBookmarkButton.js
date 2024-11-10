function createBookmarkButton() {
  const button = document.createElement("button");
  button.type = "button";
  button.classList.add("novel-bookmark__button");
  button.dataset.bookmarked = "undefined";

  const addInnerSpan = document.createElement("span");
  addInnerSpan.classList.add("novel-bookmark__button--add");
  addInnerSpan.textContent = "ブックマークする";
  button.appendChild(addInnerSpan);

  const removeInnerSpan = document.createElement("span");
  removeInnerSpan.classList.add("novel-bookmark__button--remove");
  removeInnerSpan.textContent = "ブックマーク済み";
  button.appendChild(removeInnerSpan);

  document.getElementsByTagName("main")[0].appendChild(button);
}

createBookmarkButton();
