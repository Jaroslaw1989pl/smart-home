// custom modules
const Registration = require('../models/auth-registration-model');

let data = {
  html: {
    title: ''
  },
  errors: {
    userName: '',
    userEmail: '',
    userPass: '',
    passConf: ''
  },
  registrationCompleted: false
}

exports.loginForm = (request, response, next) => {
  data.html.title = 'Playfab | Sign in';
  response.render('auth-login.ejs', data);
};

exports.registrationForm = (request, response, next) => {
  data.html.title = 'Playfab | Sign up';
  response.render('auth-registration.ejs', data);
};

exports.getUserName = (request, response, next) => {
  const registration = new Registration();
  registration.getUserName(request.query.userName)
  .then(data => {
    if (data.length > 0) response.send(true);
    else response.send(false);
  })
  .catch(error => console.log(error));
};

exports.getUserEmail = (request, response, next) => {
  const registration = new Registration();
  registration.getUserEmail(request.query.userEmail)
  .then(data => {
    if (data.length > 0) response.send(true);
    else response.send(false);
  })
  .catch(error => console.log(error));
};

exports.addUser = (request, response, next) => {
  const registration = new Registration();
  registration.setUserData(request.body.userName, request.body.userEmail, request.body.userPass, request.body.passConf);
  registration.nameValidation();
  registration.emailValidation();
  registration.passValidation();
  registration.passConfirmation();
  if (registration.isFormValid) {
    // console.log('rejestracja powiodła się', request.body);
    data.html.title = 'Playfab | Sign up';
    data.registrationCompleted = true;
    response.redirect('/registration');
  } else {
    // console.log('rejestracja NIE powiodła się', registration.errors);
    data.html.title = 'Playfab | Sign up';
    data.errors = registration.errors;
    data.registrationCompleted = false;
    response.redirect('/registration');
  }
};