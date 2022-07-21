// registration form inputs
const codeInput = document.getElementById('code');
const codeError = document.getElementById('code-error');

const newPassInput = document.getElementById('user-pass');
const passConfInput = document.getElementById('pass-conf');
const userPassInput = document.getElementById('actual-user-pass');

const newPassToggle = document.getElementById('new-pass-toggle');
const passConfToggle = document.getElementById('new-pass-conf-toggle');
const userPassToggle = document.getElementById('actual-pass-toggle');

// clear error message
codeInput.addEventListener('focus', () => codeError.style.display = 'none');

// show hide password
newPassToggle.addEventListener('click', event => {
  event.preventDefault();
  if (newPassInput.type == 'password') {
    newPassInput.type = 'text';
    newPassToggle.style.backgroundImage = 'url(/assets/auth/view.png)';
  } else {
    newPassInput.type = 'password';
    newPassToggle.style.backgroundImage = 'url(/assets/auth/hidden.png)';
  }
});

passConfToggle.addEventListener('click', event => {
  event.preventDefault();
  if (passConfInput.type == 'password') {
    passConfInput.type = 'text';
    passConfToggle.style.backgroundImage = 'url(/assets/auth/view.png)';
  } else {
    passConfInput.type = 'password';
    passConfToggle.style.backgroundImage = 'url(/assets/auth/hidden.png)';
  }
});

userPassToggle.addEventListener('click', event => {
  event.preventDefault();
  if (userPassInput.type == 'password') {
    userPassInput.type = 'text';
    userPassToggle.style.backgroundImage = 'url(/assets/auth/view.png)';
  } else {
    userPassInput.type = 'password';
    userPassToggle.style.backgroundImage = 'url(/assets/auth/hidden.png)';
  }
});