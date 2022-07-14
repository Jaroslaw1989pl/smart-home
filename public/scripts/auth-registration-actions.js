// registration form inputs
const nameInput = document.getElementById('user-name');
const emailInput = document.getElementById('user-email');
const passInput = document.getElementById('user-pass');
const confInput = document.getElementById('pass-conf');

const passToggle = document.getElementById('register-pass-toggle');
const confToggle = document.getElementById('register-conf-toggle');


// show hide password
const visabilityToggle = (event, input) => {
  event.preventDefault();
  if (input.type == 'password') {
    input.type = 'text';
    // passToggle.style.backgroundImage = 'url(/assets/auth/view.png)';
  } else {
    input.type = 'password';
    // passToggle.style.backgroundImage = 'url(/assets/auth/hidden.png)';
  }
};

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

confToggle.addEventListener('click', event => {
  event.preventDefault();
  if (confInput.type == 'password') {
    confInput.type = 'text';
    confToggle.style.backgroundImage = 'url(/assets/auth/view.png)';
  } else {
    confInput.type = 'password';
    confToggle.style.backgroundImage = 'url(/assets/auth/hidden.png)';
  }
});