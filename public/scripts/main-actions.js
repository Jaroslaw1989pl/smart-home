// navigation top bar buttons

const dropdown = document.getElementById('dropdown-toggle');

dropdown.addEventListener('click', event => {
  event.preventDefault();

  const menu = document.getElementById('user-menu');
  
  if (menu.style.display == '') menu.style.display = 'block';
  else if (menu.style.display == 'block') menu.style.display = '';
});

// logout action
// const logoutAnchor = document.getElementById('logout-anchor');
// const logoutBtn = document.getElementById('logout-btn');

// logoutAnchor.addEventListener('click', event => {
//   event.preventDefault();
//   logoutBtn.click();
// });