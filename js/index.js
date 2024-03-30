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
  if (typeof(Storage) === 'undefined') {
    // Show dialog
    const dialog = document.getElementById('incompatible-dialog');
    dialog.showModal();
    return false;
  } else {
    return true;
  }
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
  const bookCards = document.querySelectorAll('.book-card');
  const editButtons = document.querySelectorAll('button.edit');
  const deleteButtons = document.querySelectorAll('button.delete');
  const undoButtons = document.querySelectorAll('button.undo');
  const doneButtons = document.querySelectorAll('button.done');
  bookCards.forEach((card) => {
    ['mouseover', 'touchmoves'].forEach((event) => {
      card.addEventListener(event, function() {
        const buttons = card.querySelector('.book-action');
        buttons.style.display = 'flex';
      });
    });
    ['mouseout', 'touchend'].forEach((event) => {
      card.addEventListener(event, function() {
        const buttons = card.querySelector('.book-action');
        buttons.style.display = 'none';
      });
    });
  });
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
  // Show dialog
  const dialog = document.getElementById('edit-dialog');
  dialog.showModal();
  // Edit form element
  const editForm = document.getElementById('edit-form');
  const title = editForm.querySelector('#title-edit');
  const author = editForm.querySelector('#author-edit');
  const year = editForm.querySelector('#year-edit');
  const isComplete = editForm.querySelector('#is-complete-edit');
  // Get book detail
  const id = this.parentNode.parentNode.id;
  const index = books.findIndex((book) => book.id == id);
  const book = books[index]
  // Paste book detail to edit form
  title.value = book.title;
  author.value = book.author;
  year.value = book.year;
  isComplete.checked = book.isComplete;
  // Get data from edit form after submit
  dialog.addEventListener('close', function() {
    if (dialog.returnValue == 'confirm') {
      // Get data from edit form
      book.title = title.value;
      book.author = author.value;
      book.year = year.value;
      book.isComplete = isComplete.checked;
      // Add to backend
      books[index] = book;
      updateDB();
      // Update app interface
      updateShelves(books);
    }
  }, {once: true});
}

// ===ADD BOOK FORM===
const addForm = document.getElementById("add-form");

// Add new book from add-form to books array
function addBook() {
  const newBook = {};
  // Get data from add form
  newBook.id = +new Date();
  newBook.title = document.getElementById('title-add').value;
  newBook.author = document.getElementById('author-add').value;
  newBook.year = document.getElementById('year-add').value;
  newBook.isComplete = document.getElementById('is-complete-add').checked;
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
const searchInput = document.querySelector("#search-form input");

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
searchInput.addEventListener('input', function() {
  searchBook();
});

// Menu & Search Button Navigation on Header
const addHeaderButton = document.getElementById("header-add-btn");
const searchHeaderButton = document.getElementById("header-search-btn");
const searchForm = document.getElementById("search-form");

addHeaderButton.addEventListener('click', function() {
  addForm.style.display = 'flex';
  searchForm.style.display = 'none';
})

searchHeaderButton.addEventListener('click', function() {
  searchForm.style.display = 'flex';
  addForm.style.display = 'none';
})

initiateApp();