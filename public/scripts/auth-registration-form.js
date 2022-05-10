// USER NAME VALIDATION
if (document.getElementById('user-name')) {

  const nameRegex = /[^\w]/;
  const userNameInput = document.getElementById('user-name');
  const userNameError = document.getElementById('user-name-error');

  const nameValidation = () => {

    try {
      
      if (userNameInput.value == '') userNameError.textContent = '';
      else if (nameRegex.test(userNameInput.value)) throw 'The username can only contain Latin letters, numbers and underscore.';
      else if (userNameInput.value.length < 3) throw 'The username should be at least 3 characters long.';
      else if (userNameInput.value.length > 24) throw 'The username should not exceed 24 characters.';
      else {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = () => {
          if (xhttp.status == 200 && xhttp.readyState == 4) {
            if (JSON.parse(xhttp.responseText)) userNameError.textContent = 'User name already taken.';
            else userNameError.textContent = '';
          }
        }
        xhttp.open('GET', `/registration-get-user-name?userName=${userNameInput.value}`, true);
        xhttp.send();
      }
    } catch (error) {
      userNameError.textContent = error;
    }
  };

  userNameInput.addEventListener('input', nameValidation);
}


// USER EMAIL VALIDATION
if (document.getElementById('user-email')) {

  const emailRegex = /^([\w]+[.|-]{0,1}[\w]+)+@([\w]+-{0,1}[\w]+\.)+[a-zA-Z]{2,3}$/i;
  const userEmailInput = document.getElementById('user-email');
  const userEmailError = document.getElementById('user-email-error');

  const emailValidation = () => {

    try {
      
      if (userEmailInput.value == '') userEmailParagraph.textContent = '';
      else if (!emailRegex.test(userEmailInput.value)) throw 'That\'s an invalid email.';
      else if (emailRegex.test(userEmailInput.value)) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = () => {
          if (xhttp.status == 200 && xhttp.readyState == 4) {
            if (JSON.parse(xhttp.responseText)) userEmailError.textContent = 'Email address already taken.';
            else userEmailError.textContent = '';
          }
        }
        xhttp.open('GET', `/registration-get-user-email?userEmail=${userEmailInput.value}`, true);
        xhttp.send();
      }
    } catch (error) {
      userEmailError.textContent = error;
    }
  };

  userEmailInput.addEventListener('input', emailValidation);
}


// USER PASSWORD VALIDATION
if (document.getElementById('user-pass')) {
  const userPassInput = document.getElementById('user-pass');
  const userPassParagraph = document.getElementById('user-pass-error');
  // password requirements list items
  const passRequirements = document.getElementById('password-requirements');
  const passLength = document.getElementById('password-length');
  const passLetters = document.getElementById('password-letters');
  const passSymbols = document.getElementById('password-symbols');
  const passAlfaNumSymbols = document.getElementById('password-alfa-num');

  let lengthRule, lettersRule, symbolsRule, alfaNumericRule;

  const displayPassRequirements = () => {
    if (userPassInput.value === '') passRequirements.style.display = 'none';
    else if (lengthRule && lettersRule && symbolsRule && alfaNumericRule) setTimeout(() => {passRequirements.style.display = 'none';}, 1000);
    else passRequirements.style.display = 'block';
  };

  const passValidation = () => {
    // length validation
    if (userPassInput.value.trim().length >= 8) {
      passLength.style.color = 'green';
      lengthRule = true;
    } else {
      passLength.style.color = 'black';
      lengthRule = false;
    }
    // both lower and upper case validation
    if (/(?=.*[A-Z])(?=.*[a-z])/.test(userPassInput.value)) {
      passLetters.style.color = 'green';
      lettersRule = true;
    } else {
      passLetters.style.color = 'black';
      lettersRule = false;
    }
    // number and symbol validation
    if (/(?=.*[0-9_])/.test(userPassInput.value)) {
      passSymbols.style.color = 'green';
      symbolsRule = true;
    } else {
      passSymbols.style.color = 'black';
      symbolsRule = false;
    }
    // alfanumeric symbols validation
    if (/[^\w]/.test(userPassInput.value)) {
      passAlfaNumSymbols.style.color = 'black';
      alfaNumericRule = false;
    } else {
      passAlfaNumSymbols.style.color = 'green';
      alfaNumericRule = true;
    }

    displayPassRequirements();
    passConfValidation();
    // unset password error
    userPassParagraph.textContent = '';
  };

  userPassInput.addEventListener('input', passValidation);

  // confirmed pass validation
  const userPassConfInput = document.getElementById('pass-conf');
  const userPassConfParagraph = document.getElementById('pass-conf-error');
  
  const passConfValidation = () => {
    if (userPassConfInput.value.length > 0) {
      if (userPassInput.value === userPassConfInput.value) userPassConfParagraph.textContent = '';
      else userPassConfParagraph.textContent = 'Passwords are not the same.';
    } else {
      userPassConfParagraph.textContent = '';
    }
  };
  
  userPassConfInput.addEventListener('input', passConfValidation);
}