// login form inputs
const emailInput = document.getElementById('user-email');
const passInput = document.getElementById('user-pass');
const passToggle = document.getElementById('login-pass-toggle');
// login form messages
const errorMessage = document.getElementById('login-error');

// clear auth errors
const clearError = () => {
  errorMessage.textContent = '';
  errorMessage.style.display = 'none';
};

emailInput.addEventListener('input', clearError);
passInput.addEventListener('input', clearError);

// show hide password
passToggle.addEventListener('click', event => {
  event.preventDefault();
  if (passInput.type == 'password') {
    passInput.type = 'text';
    passToggle.style.backgroundImage = 'url(/assets/auth/view.png)';
  } else {
    passInput.type = 'password';
    passToggle.style.backgroundImage = 'url(/assets/auth/hidden.png)';
  }
});