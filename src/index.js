import $ from 'jquery';

import './index.css';
import api from './api';

import bookmarkList from './bookmark-list';
import store from './store';

const main = function () {
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarkList.render();
    });


  bookmarkList.bindEventListeners();
  bookmarkList.render();
};

$(main);