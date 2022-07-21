// form inputs
const codeInput = document.getElementById('code');
const codeError = document.getElementById('code-error');
const passInput = document.getElementById('user-pass');
const passToggle = document.getElementById('pass-toggle');
const passError = document.getElementById('password-error');

// clear error message
if (codeInput) codeInput.addEventListener('focus', () => codeError.style.display = 'none');

// clear error message
if (passInput) passInput.addEventListener('focus', () => passError.style.display = 'none');

// show hide password
if (passInput) passToggle.addEventListener('click', event => {
  event.preventDefault();
  if (passInput.type == 'password') {
    passInput.type = 'text';
    passToggle.style.backgroundImage = 'url(/assets/auth/view.png)';
  } else {
    passInput.type = 'password';
    passToggle.style.backgroundImage = 'url(/assets/auth/hidden.png)';
  }
});