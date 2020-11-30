import { post } from 'jquery';

export default {
  getBookmarks,
  createBookmark,
  updateBookmark,
  deleteBookmark
};

const BASE_URL = 'https://thinkful-list-api.herokuapp.com/[tyler-krzyzanowski]';

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
    });
};

function getBookmarks(){
  return fetch(`${BASE_URL}/bookmarks`);
}

function createBookmark(bookmark){
  let newBookmark = {
    'name': bookmark.name,
    'description': bookmark.description,
    'link': bookmark.link,
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
  let updatedBookmark = listApiFetch(`${BASE_URL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(updateData)
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

