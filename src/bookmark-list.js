import $ from 'jquery';

import store from './store';
import api from './api';

const generateBookmarkElement = function (bookmark) {
  
};

const generateDefaultButtons = function(){
  return `
    <div class=".js-default-buttons">  
      <button type='button' id='add'>
        <span class='button-label'>Add</span>
      </button>
    </div>`;
};

const generateBookmarksString = function (bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => generateBookmarkElement(bookmark));
  return bookmarks.join('');
};

const render = function () {
  let bookmarks = [...store.bookmarks];
  console.log('hello');

  const BookmarksString = generateBookmarksString(bookmarks);
  const defaultButtons = generateDefaultButtons();

  $('main').html(defaultButtons + BookmarksString);
};

const handleNewBookmarkSubmit = function () {
  $('#js-bookmark-list-form').submit(function (event) {
    event.preventDefault();
    const newBookmarkName = $('.js-bookmark-list-entry').val();
    $('.js-bookmark-list-entry').val('');
    api.createBookmark(newBookmarkName)
      .then(res => res.json())
      .then((newBookmark) => {
        store.addBookmark(newBookmark);
        render();
      });
  });
};

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest('.js-bookmark-element')
    .data('bookmark-id');
};

const handleDeleteBookmarkClicked = function () {
  // like in `handleBookmarkCheckClicked`, we use event delegation
  $('.js-bookmark-list').on('click', '.js-bookmark-delete', event => {
    // get the index of the bookmark in store.bookmarks
    const id = getBookmarkIdFromElement(event.currentTarget);
    // delete the bookmark
    api.deleteBookmark(id);
    store.findAndDelete(id);
    // render the updated shopping list
    render();
  });
};

const handleEditBookmarkSubmit = function () {
  $('.js-bookmark-list').on('submit', '.js-edit-bookmark', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    const bookmarkName = $(event.currentTarget).find('.shopping-bookmark').val();
    api.updateBookmark(id, {name: bookmarkName})
      .then(res => res.json())
      .then(res => {
        store.findAndUpdate(id, {name: bookmarkName});
        render();
      });
  });
};

const handleBookmarkCheckClicked = function () {
  $('.js-bookmark-list').on('click', '.js-bookmark-toggle', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    let currentBookmark = store.findById(id);
    api.updateBookmark(id, {checked: !currentBookmark.checked})
      .then(res => res.json())
      .then(res => {
        store.findAndUpdate(id, {checked: !currentBookmark.checked});
        render();
      });


  });
};

const handleToggleFilterClick = function () {
  $('.js-filter-checked').click(() => {
    store.toggleCheckedFilter();
    render();
  });
};

const bindEventListeners = function () {
  handleNewBookmarkSubmit();
  handleBookmarkCheckClicked();
  handleDeleteBookmarkClicked();
  handleEditBookmarkSubmit();
  handleToggleFilterClick();
};
// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};