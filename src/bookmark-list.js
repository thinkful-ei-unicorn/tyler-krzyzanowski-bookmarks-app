import $ from 'jquery';
import {isWebUri} from 'valid-url';
import store from './store';
import api from './api';

let adding = false;
let isValidUrl = true;
let minStars = 1;

const generateBookmarkElement = function (bookmark) {
  if(bookmark.editing){
    return `
  <div class="bookmark" id=${bookmark.id}>
    <form class="edit-form">
      <div>
        <label>Name</label>
        <input type='text' id='bookmark-edit-name' name='name' value=${bookmark.title}>
        <label>URL</label>
        <input type='text' id='bookmark-edit-url' name='URL' value=${bookmark.url}>
        <p ${isValidUrl ? 'hidden' : ''}>Please enter a valid URL</p>
      </div>
      <div>
        <textarea id='bookmark-edit-description' placeholder='Description' cols='60' rows='6'>${bookmark.desc}</textarea>
      </div>
      <div>
        <p>Rating</p>
        <input type="radio" id="1" name="rating-edit" required="required" value="1">
        <label for="1">1</label><br>
        <input type="radio" id="2" name="rating-edit" value="2">
        <label for="2">2</label><br>
        <input type="radio" id="3" name="rating-edit" value="3">
        <label for="3">3</label><br>
        <input type="radio" id="4" name="rating-edit" value="4">
        <label for="4">4</label><br>
        <input type="radio" id="5" name="rating-edit" value="5">
        <label for="5">5</label><br>
      </div>
      <button id='edit-submit' type='submit'>Submit</button>
    </form>
  </div>`;
  }
  else if(bookmark.expanded){
    return `
  <div class="bookmark expanded-bookmark" id=${bookmark.id}>
    <div class="title">
      <h2>${bookmark.title}</h2>
    </div>
    <div class="desc">
      <p>${bookmark.desc}</p>
    </div>
    <div class="url">
      <p><a href=${bookmark.url}>${bookmark.url}</a></p>
    </div>
    <div class="rating">
      <h3>${bookmark.rating}/5</h3>
    </div>
    <div class="buttons">
      <button class="edit" type="button">Edit</button>
      <button class="delete" type="button">Delete</button>
      <button class="collapse" type="button">Collapse</button>
    </div>
  </div>`;
  }
  else{
    return `
  <div class="bookmark" id=${bookmark.id}>
    <div class="title">
      <h2>${bookmark.title}</h2>
    </div>
    <div class="rating">
      <h3>${bookmark.rating}/5</h3>
    </div>
    <button class="expand" type="button">Expand</button>
  </div>`;
  }
};

const generateDefaultButtons = function(){
  return `
    <div class="js-default-buttons">  
    <div class="dropdown">
    <label>Filter</label>
      ${generateSelectOptions()}
      </div>
      <button type='button' id='add'>
        <span class='button-label'>Add</span>
      </button>
    </div>`;
};

const generateAddSection = function(){
  return `
  <div class="add-section">
    <form class="add-section-form">
    <div class="left">
      <div>
        <label>Name</label>
        <input type='text' id='bookmark-submit-name' required="required" name='name'>
      </div>
      <div>
        <label>URL</label>
        <input type='text' id='bookmark-submit-url' required="required" name='URL'>
        <p ${isValidUrl ? 'hidden' : ''}>Please enter a valid URL</p>
      </div>
      <div>
        <textarea id='bookmark-submit-description' placeholder='Description' cols='30' rows='6'></textarea>
      </div>
    </div>
    <div class="right">
      <div>
        <p>Rating</p>
        <input type="radio" id="1" name="rating" required="required" value="1">
        <label for="1">1</label><br>
        <input type="radio" id="2" name="rating" value="2">
        <label for="2">2</label><br>
        <input type="radio" id="3" name="rating" value="3">
        <label for="3">3</label><br>
        <input type="radio" id="4" name="rating" value="4">
        <label for="4">4</label><br>
        <input type="radio" id="5" name="rating" value="5">
        <label for="5">5</label><br>
      </div>
      <button id='submit' type='submit'>Submit</button>
    </div>
    </form>
  </div>`;
};

const generateBookmarksString = function (bookmarkList) {
  const bookmarks = bookmarkList.map((bookmark) => {
    if(bookmark.rating >= minStars){
      return generateBookmarkElement(bookmark);
    }
  });
  return bookmarks.join('');
};

const render = function () {
  let bookmarks = [...store.bookmarks];

  const BookmarksString = generateBookmarksString(bookmarks);
  const defaultButtons = generateDefaultButtons();
  if(adding){
    let addForm = generateAddSection();
    $('main').html(addForm + BookmarksString);
  }
  else{
    $('main').html(defaultButtons + BookmarksString);
  }
};

const generateSelectOptions = function () {
  let selectOptions = '<select class="filter">';
  
  for(let i = 1; i < 6; i++){
    // eslint-disable-next-line eqeqeq
    if(i == minStars){
      selectOptions += `<option value=${i} selected="selected">${i} or more stars</option>`;
    }
    else{
      selectOptions += `<option value=${i}>${i} or more stars</option>`;
    }
  }
  selectOptions += '</select>';
  return selectOptions;
};

const handleExpandClick = function () {
  $('main').on('click', '.expand', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    store.findAndUpdate(id, {expanded: true});
    render();
  });
};

const handleFilterSelcect = function () {
  $('main').on('change', '.filter', event => {
    minStars = $('.filter').val();
    render();
  });
};

const handleCollapseClick = function () {
  $('main').on('click', '.collapse', event => {
    const id = getBookmarkIdFromElement(event.currentTarget);
    store.findAndUpdate(id, {expanded: false});
    render();
  });
};

const handleEditBookmarkClick = function () {
  $('main').on('click', '.edit', event => {
    event.preventDefault();
    // get the index of the bookmark in store.bookmarks
    const id = getBookmarkIdFromElement(event.currentTarget);
    store.findAndUpdate(id, {editing: true});
    adding=false;
    // delete the bookmark
    render();
    // render the updated shopping list
  });
};

const handleEditBookmarkSubmit = function () {
  $('main').on('submit', '.edit-form', event => {
    event.preventDefault();
    const id = getBookmarkIdFromElement(event.currentTarget);
    let url = $('#bookmark-edit-url').val();
    if(!isWebUri(url)){
      isValidUrl = false;
    }
    else{
      isValidUrl = true;
      store.findAndUpdate(id, {editing: false});
      const bookmark = {
        'title': $('#bookmark-edit-name').val(),
        'desc': $('#bookmark-edit-description').val(),
        'url': $('#bookmark-edit-url').val(),
        'rating': $('input[name=rating-edit]:checked').val()
      };
      api.updateBookmark(id, bookmark)
        .then(bookmark => store.findAndUpdate(id, bookmark));
      store.findAndUpdate(id, {
        'title': bookmark.title,
        'url': bookmark.url,
        'desc': bookmark.desc,
        'rating': bookmark.rating,
        editing: false});
    }
    
    render();
  });
  

};

const handleNewBookmarkSubmit = function () {
  $('main').on('submit', '.add-section-form', function (event) {
    event.preventDefault();
    let url = $('#bookmark-submit-url').val();
    if(!isWebUri(url)){
      isValidUrl = false;
      render();
    }
    else{
      adding = false;
      isValidUrl = true;
      const newBookmarkName = $('#bookmark-submit-name').val();
      const newBookmarkLink = $('#bookmark-submit-url').val();
      const newBookmarkDescription= $('#bookmark-submit-description').val();
      const newBookmarkRating = $('input[name=rating]:checked').val();
      const newBookmark = {
        'name': newBookmarkName,
        'description': newBookmarkDescription,
        'link': newBookmarkLink,
        'rating': newBookmarkRating
      };
      $('.js-bookmark-list-entry').val('');
      api.createBookmark(newBookmark)
        .then((newBookmark) => {
          store.addBookmark(newBookmark);
          render();
        }).catch(e => console.log(e));
    }
  });
};

const getBookmarkIdFromElement = function (bookmark) {
  return $(bookmark)
    .closest('.bookmark')
    .attr('id');
};

const handleDeleteBookmarkClicked = function () {
  // like in `handleBookmarkCheckClicked`, we use event delegation
  $('main').on('click', '.delete', event => {
    // get the index of the bookmark in store.bookmarks
    const id = getBookmarkIdFromElement(event.currentTarget);
    // delete the bookmark
    api.deleteBookmark(id)
      .then(bookmark => {
        store.findAndDelete(id);
        render();
      });
    // render the updated shopping list
  });
};

const handleAddButtonClick = function(){
  $('main').on('click', '#add', event =>{
    adding = true;
    render();
  });
};

const bindEventListeners = function () {
  handleNewBookmarkSubmit();
  handleDeleteBookmarkClicked();
  handleEditBookmarkSubmit();
  handleAddButtonClick();
  handleEditBookmarkClick();
  handleExpandClick();
  handleCollapseClick();
  handleFilterSelcect();
};
// This object contains the only exposed methods from this module:
export default {
  render,
  bindEventListeners
};