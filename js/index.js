/*
{
  id: string | number,
  title: string,
  author: string,
  year: number,
  isComplete: boolean,
}
*/

function isLocalStorageExist() {
  return typeof(Storage) !== 'undefined' ? true : false;
}
