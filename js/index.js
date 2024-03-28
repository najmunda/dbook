/*
{
  id: number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

let books = [];

// ===LOCALSTORAGE COMPABILITY===
// Check browser compatibility on local storage
function isLocalStorageExist() {
  return typeof(Storage) !== 'undefined' ? true : false;
}

// ===FIRST APP INITIATION===
// Initiate localstorage on first open
function initiateApp() {
  if (isLocalStorageExist()) {
    // If application is opened for the first time
    if (localStorage.getItem('data') == null) {
      localStorage.setItem('data', JSON.stringify([]));
    } else { // If application has been used before.
      books = JSON.parse(localStorage.getItem('data'));
      updateShelves(books);
    }
  }
}

// ===SYNC array & LOCALSTORAGE===
// Sync session list and local storage every change
function updateDB() {
  if (isLocalStorageExist()) {
    localStorage.setItem('data', JSON.stringify(books));
  }
}

// ===UPDATE SHELF (INTERFACE)===
// Update shelves interface every change based on books array
function updateShelves(booksArray = []) {
  const completeShelf = document.querySelector("#complete-shelf-div .books-div");
  const uncompleteShelf = document.querySelector("#uncomplete-shelf-div .books-div");
  // Reset interface
  completeShelf.innerHTML = '';
  uncompleteShelf.innerHTML = '';
  for (let book of booksArray) {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book-card');
    bookDiv.id = book.id;
    // Add book detail
    bookDiv.innerHTML = `<div class="book-detail">
                          <h3>${book.title}</h3>
                          <p>${book.author}</p>
                          <p>${book.year}</p>
                        </div>`;
    // Add book action button based on isComplete value
    if (book.isComplete) {
      bookDiv.innerHTML += `<div class="book-action">
                              <button class="material-symbols-outlined edit">edit</button>
                              <button class="material-symbols-outlined delete">delete</button>
                              <button class="material-symbols-outlined undo">undo</button>
                            </div>`;
      completeShelf.appendChild(bookDiv);
    } else {
      bookDiv.innerHTML += `<div class="book-action">
                              <button class="material-symbols-outlined edit">edit</button>
                              <button class="material-symbols-outlined delete">delete</button>
                              <button class="material-symbols-outlined done">done</button>
                            </div>`;     
      uncompleteShelf.appendChild(bookDiv); 
    }
  }
  // Add event listener to button
  let editButtons = document.querySelectorAll('button.edit');
  let deleteButtons = document.querySelectorAll('button.delete');
  let undoButtons = document.querySelectorAll('button.undo');
  let doneButtons = document.querySelectorAll('button.done');
  editButtons.forEach((button) => {
    button.addEventListener('click', editBook);
  });
  deleteButtons.forEach((button) => {
    button.addEventListener('click', deleteBook);
  });
  undoButtons.forEach((button) => {
    button.addEventListener('click', reverseIsComplete);
  });
  doneButtons.forEach((button) => {
    button.addEventListener('click', reverseIsComplete);
  });
}

// ===DELETE BOOK===
// Remove book from books array
function deleteBook() {
  // Get book id
  const id = this.parentNode.parentNode.id;
  // Show dialog
  const dialog = document.getElementById('delete-dialog');
  dialog.showModal();
  // Decide deleting on pressed dialog button
  dialog.addEventListener('close', function() {
    console.log(dialog.returnValue);
    if (dialog.returnValue == 'confirm') {
      // Delete from backend
      const index = books.findIndex((book) => book.id == id);
      books.splice(index, 1);
      updateDB();
      // Update app interface
      updateShelves(books);
    }
  }, {once: true});
}

// ===Move Book to Complete/Uncomplete Shelf===
// Reverse boolean book.isComplete on books array
function reverseIsComplete() {
  const id = this.parentNode.parentNode.id;
  // Reverse book.isComplete boolean
  const index = books.findIndex((book) => book.id == id);
  books[index].isComplete = !books[index].isComplete;
  const book = books[index]
  books.splice(index, 1);
  books.unshift(book);
  updateDB();
  // Update app interface
  updateShelves(books);
}

// ===EDIT BOOK FORM===
function editBook() {
  const id = this.parentNode.parentNode.id;
  // Reverse book.isComplete boolean
  const index = books.findIndex((book) => book.id == id);
  books[index].isComplete = !books[index].isComplete;
  const book = books[index]
  books.splice(index, 1);
  books.unshift(book);
  updateDB();
  // Update app interface
  updateShelves(books);
}

// ===ADD BOOK FORM===
const addForm = document.getElementById("add-form");

// Add new book from add-form to books array
function addBook() {
  const newBook = {};
  // Get data from form
  newBook.id = +new Date();
  newBook.title = document.getElementById('title').value;
  newBook.author = document.getElementById('author').value;
  newBook.year = document.getElementById('year').value;
  newBook.isComplete = document.getElementById('is-complete').checked;
  // Add to backend
  books.unshift(newBook);
  updateDB();
  // Update app interface
  updateShelves(books);
}

addForm.addEventListener('submit', function(event) {
  addBook();
  this.reset();
  event.preventDefault();
});

// ===SEARCH FORM===
const searchForm = document.getElementById("search-form");
const refreshSearchButton = document.querySelector('button.refresh-search');

// Search book from books array
function searchBook() {
  // Get data from form
  const searchTitle = document.getElementById('search').value;
  // Filter books array
  const searchedBooks = books.filter((book) => book.title.includes(searchTitle));
  // Update app interface
  updateShelves(searchedBooks);
}

// Search button
searchForm.addEventListener('submit', function(event) {
  searchBook();
  event.preventDefault();
});

// Refresh button
refreshSearchButton.addEventListener('click', function () {
  updateShelves(books);
});

initiateApp();