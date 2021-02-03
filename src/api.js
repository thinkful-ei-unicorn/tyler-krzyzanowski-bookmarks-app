import { post } from 'jquery';

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/tyler-krzyzanowski';

const listApiFetch = function (...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if (!res.ok) {
        error = { code: res.status };
        if (!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      else return res.json();
    });
};

function getBookmarks(){
  return listApiFetch(`${BASE_URL}/bookmarks`);
}

function createBookmark(bookmark){
  let newBookmark = {
    'title': bookmark.name,
    'desc': bookmark.description,
    'url': bookmark.link,
    'rating': bookmark.rating,
  };
  let newBookmarkJson = JSON.stringify(newBookmark);
  let result = listApiFetch(`${BASE_URL}/bookmarks`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: newBookmarkJson
  });
  return result;
}

function updateBookmark(id, updateData){
  let bookmark = {
    'title': updateData.title,
    'url': updateData.url,
    'desc': updateData.desc,
    'rating': updateData.rating
  };
  let updatedBookmark = listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bookmark)
  });
  return updatedBookmark;
}

function deleteBookmark(id){
  let deletedBookmark = listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(this)
  });
  return deletedBookmark;
}

