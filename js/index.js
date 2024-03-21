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
  return typeof(Storage) !== 'undefined' ? true : false;
}

let addForm = document.getElementById("add-form")

// 
addForm.addEventListener('submit', function(event) {
  let name = document.getElementById('name').value;
  let author = document.getElementById('author').value;
  let year = document.getElementById('year').value;
  let isComplete = document.getElementById('is-complete').value;
  console.log(name, author, year, isComplete);
  event.preventDefault();
});