/*
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

let books = [];

// Check browser compatibility on local storage
function isLocalStorageExist() {
  if (typeof(Storage) !== 'undefined') {
    // If application is opened for the first time
    if (localStorage.getItem('data') == null) {
      localStorage.setItem('data', JSON.stringify([]));
    } else { // If application has been used before.
      books = JSON.parse(localStorage.getItem('data'));
      updateShelves();
    }
    return true;
  } else {
    alert('Mohon maaf, aplikasi ini tidak bisa digunakan karena browser anda tidak mendukung fitur Local Storage.')
    return false;
  }
}

// Sync session list and local storage every change
function updateDB() {
  localStorage.setItem('data', JSON.stringify(books));
}

// Update shelves interface every change based on books array
function updateShelves() {
  const completeShelf = document.querySelector("#complete-shelf-div .books-div");
  const uncompleteShelf = document.querySelector("#uncomplete-shelf-div .books-div");
  // Reset interface
  completeShelf.innerHTML = '';
  uncompleteShelf.innerHTML = '';
  for (let book of books) {
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
                              <button class="material-symbols-outlined edit">edit_note</button>
                              <button class="material-symbols-outlined delete">delete</button>
                              <button class="material-symbols-outlined undo">undo</button>
                            </div>`;
      completeShelf.appendChild(bookDiv);
    } else {
      bookDiv.innerHTML += `<div class="book-action">
                              <button class="material-symbols-outlined edit">edit_note</button>
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

//
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
  updateShelves();
}

// Remove book from books array
function deleteBook() {
  const id = this.parentNode.parentNode.id;
  // Delete from backend
  const index = books.findIndex((book) => book.id == id);
  books.splice(index, 1);
  updateDB();
  // Update app interface
  updateShelves();
}

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
  updateShelves();
}

// Add new book from add-form to books array
let addForm = document.getElementById("add-form")

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
  updateShelves();
}

addForm.addEventListener('submit', function(event) {
  addBook();
  event.preventDefault();
});

isLocalStorageExist();