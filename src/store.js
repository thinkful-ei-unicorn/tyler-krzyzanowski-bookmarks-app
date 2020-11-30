const bookmarks = [];
let hideCheckedBookmarks = false;
const error = null;

const findById = function (id) {
  return this.bookmarks.find(currentBookmark => currentBookmark.id === id);
};

const addBookmark = function (bookmark) {
  this.bookmarks.push(bookmark);
};

const findAndDelete = function (id) {
  this.bookmarks = this.bookmarks.filter(currentBookmark => currentBookmark.id !== id);
};

const findAndUpdate = function (id, newData){
  let found = this.bookmarks.find(bookmark => bookmark.id === id);
  Object.assign(found, newData);
};

const toggleCheckedFilter = function () {
  this.hideCheckedBookmarks = !this.hideCheckedBookmarks;
};

const setError = function (error) {
  this.error = error;
};

export default {
  bookmarks,
  hideCheckedBookmarks,
  error,
  findById,
  addBookmark,
  findAndUpdate,
  findAndDelete,
  toggleCheckedFilter
};