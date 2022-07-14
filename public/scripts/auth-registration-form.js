// AVATAR CHECKBOX 
if (document.getElementById('img-box')) {
  
  const checkboxGroup = document.querySelectorAll('#img-box input[type="checkbox"]');

  checkboxGroup.forEach(checkbox => checkbox.addEventListener('click', () => {
    document.getElementById('user-avatar-error').style.display = 'none';
    const id = checkbox.id;
    checkboxGroup.forEach(checkbox => {
      if (checkbox.id !== id) checkbox.checked = false;
    });
  }));
}

// USER NAME VALIDATION
if (document.getElementById('user-name')) {

  const nameRegex = /[^\w]/;
  const userNameInput = document.getElementById('user-name');
  const userNameError = document.getElementById('user-name-error');
  // password requirements list items
  const nameRequirements = document.getElementById('user-name-requirements');
  const nameLength = document.getElementById('user-name-length');
  const nameAlfaNumSymbols = document.getElementById('user-name-alfa-num');
  const nameUniqueness = document.getElementById('user-name-uniqueness');

  let lengthRule, alfaNumericRule, uniquenessRule;

  const displayNameRequirements = () => {
    userNameError.style.display = 'none';
    nameRequirements.style.display = 'block';
    nameValidation();
  };
  const hideNameRequirements = () => {
    // if (!lengthRule || !alfaNumericRule || !uniquenessRule) {
    //   userNameInput.parentElement.style.borderBottomColor = 'red';
    //   userNameInput.parentElement.style.borderBottomWidth = '2px';
    //   userNameInput.parentElement.style.marginBottom = '24px';
    // } else {
    //   userNameInput.parentElement.style.borderBottomColor = '#c2c2c2';
    //   userNameInput.parentElement.style.borderBottomWidth = '1px';
    //   userNameInput.parentElement.style.marginBottom = '25px';
    // }
    if (lengthRule && alfaNumericRule && uniquenessRule) nameRequirements.style.display = 'none';
  };

  const nameValidation = () => {

    // length validation
    if (userNameInput.value.trim().length > 2 && userNameInput.value.trim().length < 25) {
      nameLength.style.color = 'green';
      lengthRule = true;
    } else {
      nameLength.style.color = '#7e7e7e';
      lengthRule = false;
      nameUniqueness.style.color = '#7e7e7e';
      uniquenessRule = false;
    }
    // alfanumeric symbols validation
    if (/[^\w]/.test(userNameInput.value)) {
      nameAlfaNumSymbols.style.color = '#7e7e7e';
      alfaNumericRule = false;
    } else {
      nameAlfaNumSymbols.style.color = 'green';
      alfaNumericRule = true;
    }

    if (userNameInput.value.trim().length === 0) {
      nameLength.style.color = '#7e7e7e';
      lengthRule = false;
      nameAlfaNumSymbols.style.color = '#7e7e7e';
      alfaNumericRule = false;
      nameUniqueness.style.color = '#7e7e7e';
      uniquenessRule = false;
    }

    // umiqueness validation
    if (lengthRule && alfaNumericRule) {
      const xhttp = new XMLHttpRequest();
      xhttp.onload = () => {
        if (xhttp.status == 200 && xhttp.readyState == 4) {
          if (JSON.parse(xhttp.responseText)) {
            nameUniqueness.style.color = '#7e7e7e';
            uniquenessRule = false;
          } else {
            nameUniqueness.style.color = 'green';
            uniquenessRule = true;
          }
        }
      }
      xhttp.open('GET', `/registration-get-user-name?userName=${userNameInput.value}`, true);
      xhttp.send();
    }

    // unset name error
    userNameError.style.display = 'none';
  };

  userNameInput.addEventListener('input', nameValidation);
  userNameInput.addEventListener('focus', displayNameRequirements);
  userNameInput.addEventListener('blur', hideNameRequirements);
}


// USER EMAIL VALIDATION
if (document.getElementById('user-email')) {

  const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const userEmailInput = document.getElementById('user-email');
  const userEmailError = document.getElementById('user-email-error');

  const emailValidation = () => {

    try {
      if (userEmailInput.value == '') userEmailError.style.display = 'none';
      else if (!emailRegex.test(userEmailInput.value)) throw 'That\'s an invalid email.';
      else if (emailRegex.test(userEmailInput.value)) {
        const xhttp = new XMLHttpRequest();
        xhttp.onload = () => {
          if (xhttp.status == 200 && xhttp.readyState == 4) {
            if (JSON.parse(xhttp.responseText)) {
              userEmailError.style.display = 'block';
              userEmailError.textContent = 'Email address already taken.';
            } else {
              userEmailError.style.display = 'none';
            }
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
  userEmailInput.addEventListener('focus', () => userEmailError.style.display = 'none');
}


// USER PASSWORD VALIDATION
if (document.getElementById('user-pass')) {

  const userPassInput = document.getElementById('user-pass');
  const userPassParagraph = document.getElementById('user-pass-error');
  // password requirements list items
  const passRequirements = document.getElementById('user-pass-requirements');
  const passLength = document.getElementById('password-length');
  const passLetters = document.getElementById('password-letters');
  const passSymbols = document.getElementById('password-symbols');
  const passAlfaNumSymbols = document.getElementById('password-alfa-num');

  let lengthRule, lettersRule, symbolsRule, alfaNumericRule;

  const displayPassRequirements = () => {
    userPassParagraph.style.display = 'none';
    passRequirements.style.display = 'block';
    passValidation();
  };
  const hidePassRequirements = () => {
    if (lengthRule && lettersRule && symbolsRule && alfaNumericRule) passRequirements.style.display = 'none';
  };

  const passValidation = () => {

    // length validation
    if (userPassInput.value.trim().length >= 8) {
      passLength.style.color = 'green';
      lengthRule = true;
    } else {
      passLength.style.color = '#7e7e7e';
      lengthRule = false;
    }
    // both lower and upper case validation
    if (/(?=.*[A-Z])(?=.*[a-z])/.test(userPassInput.value)) {
      passLetters.style.color = 'green';
      lettersRule = true;
    } else {
      passLetters.style.color = '#7e7e7e';
      lettersRule = false;
    }
    // number and symbol validation
    if (/(?=.*[0-9_])/.test(userPassInput.value)) {
      passSymbols.style.color = 'green';
      symbolsRule = true;
    } else {
      passSymbols.style.color = '#7e7e7e';
      symbolsRule = false;
    }
    // alfanumeric symbols validation
    if (/[^\w]/.test(userPassInput.value)) {
      passAlfaNumSymbols.style.color = '#7e7e7e';
      alfaNumericRule = false;
    } else {
      passAlfaNumSymbols.style.color = 'green';
      alfaNumericRule = true;
    }

    if (userPassInput.value.trim().length === 0) {
      passLength.style.color = '#7e7e7e';
      lengthRule = false;
      passLetters.style.color = '#7e7e7e';
      lettersRule = false;
      passSymbols.style.color = '#7e7e7e';
      symbolsRule = false;
      passAlfaNumSymbols.style.color = '#7e7e7e';
      alfaNumericRule = false;
    }

    passConfValidation();
  };

  userPassInput.addEventListener('input', passValidation);
  userPassInput.addEventListener('focus', displayPassRequirements);
  userPassInput.addEventListener('blur', hidePassRequirements);

  // confirmed pass validation
  const userPassConfInput = document.getElementById('pass-conf');
  const userPassConfParagraph = document.getElementById('pass-conf-error');

  const passConfValidation = () => {
    if (userPassConfInput.value.length > 0 || userPassInput.value !== userPassConfInput.value) {
      userPassConfParagraph.style.display = 'block';
      userPassConfParagraph.textContent = 'Passwords are not the same.';
    } else {
      userPassConfParagraph.style.display = 'none';
    }
  };
  
  userPassConfInput.addEventListener('input', passConfValidation);
  
  if (document.getElementById('pass-uniq-error')) {
    const passUniquenessError = document.getElementById('pass-uniq-error');
    userPassInput.addEventListener('focus', () => passUniquenessError.style.display = 'none');
    userPassConfInput.addEventListener('focus', () => passUniquenessError.style.display = 'none');
  }
}
