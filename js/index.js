/*
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

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

let addForm = document.getElementById("add-form")
let books = [];

// Sync session list and local storage every change
function updateDB() {
  localStorage.setItem('data', JSON.stringify(books));
}

// Update shelves interface every change
function updateShelves() {
  const completeShelf = document.querySelector("#complete-shelf-div .books-div");
  const uncompleteShelf = document.querySelector("#uncomplete-shelf-div .books-div");
  // Reset interface
  completeShelf.innerHTML = '';
  uncompleteShelf.innerHTML = '';
  for (let book of books) {
    const bookDiv = document.createElement('div');
    bookDiv.classList.add('book-card')
    // Add book detail
    bookDiv.innerHTML = `<div class="book-detail">
                          <h3>${book.title}</h3>
                          <p>${book.author}</p>
                          <p>${book.year}</p>
                        </div>`;
    // Add book action button based on isComplete value
    if (book.isComplete) {
      bookDiv.innerHTML += `<div class="book-action">
                              <span class="material-symbols-outlined">delete</span>
                              <span class="material-symbols-outlined">undo</span>
                            </div>`;
      completeShelf.appendChild(bookDiv);
    } else {
      bookDiv.innerHTML += `<div class="book-action">
                              <span class="material-symbols-outlined">delete</span>
                              <span class="material-symbols-outlined">done</span>
                            </div>`;     
      uncompleteShelf.appendChild(bookDiv); 
    }
  }
}

// Add new book from add-form
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

// Change isComplete status of a book
function reverseIsComplete(bookID) {

}

// Delete book from application
function deleteBook(bookID) {

}

isLocalStorageExist();