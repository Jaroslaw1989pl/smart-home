// custom modules
const Registration = require('../models/auth-registration-model');


exports.loginForm = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Sign in'
    }
  };
  response.render('auth-login.ejs', data);
};

exports.registrationForm = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Sign up'
    }
  };
  response.render('auth-registration.ejs', data);
};

exports.getUserName = (request, response, next) => {
  const registration = new Registration();
  
  // registration.getUserName(request.query.userName, result => {
  //   if (result.length > 0) response.send(true);
  //   else response.send(false);
  // });

  registration.getUserName(request.query.userName)
  .then(data => {
    if (data.length > 0) response.send(true);
    else response.send(false);
  })
  .catch(error => console.log(error));
};

exports.getUserEmail = (request, response, next) => {
  const registration = new Registration();
  
  // registration.getUserEmail(request.query.userEmail, result => {
  //   if (result.length > 0) response.send(true);
  //   else response.send(false);
  // });

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

  registration.getUserName(request.body.userName)
  .then(data => {
    // console.log(data);
    if (data.length > 0) {
      registration.errors.userName = 'User name already taken.';
      registration.isFormValid = false;
    }
    return registration.getUserEmail(request.body.userEmail);
  })
  .then(data => {
    // console.log(data);
    if (data.length > 0) {
      registration.errors.userEmail = 'Email address already taken.';
      registration.isFormValid = false;
    }
    return;
  })
  .then(() => {
    if (registration.isFormValid) {
      // console.log('rejestracja powiodła się', request.body);
      let data = {
        html: {
          title: 'Playfab | Sign up'
        },
        registrationCompleted: true
      };
      // response.redirect('/registration');
      response.render('auth-registration.ejs', data);
    } else {
      // console.log('rejestracja NIE powiodła się', registration.errors);
      let data = {
        html: {
          title: 'Playfab | Sign up'
        },
        errors: registration.errors
      };
      // response.redirect('/registration');
      response.render('auth-registration.ejs', data);
    }
  })
  .catch(error => console.log(error));
};