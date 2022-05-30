// custom modules
const DeleteUser = require('../models/auth-delete-model');
const NewPassword = require('../models/auth-new-password-model');


/*** PUBLIC VIEWS ***/

exports.home = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Home page'
    }
  };
  response.render('home.ejs', data);
};

/*** AUTHENTICATION ***/

/*** USER REGISTRATION ***/

exports.registrationForm = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Sign up'
    },
    inputs: request.session.inputs,
    errors: request.session.errors,
    isRegistrationCompleted: request.session.isRegistrationCompleted
  };

  request.session.inputs = undefined;
  request.session.errors = undefined;
  request.session.isRegistrationCompleted = undefined;

  response.render('auth-registration.ejs', data);
};

/*** USER LOGIN ***/

exports.loginForm = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Sign in'
    },
    inputs: request.session.inputs,
    errors: request.session.errors
  };

  request.session.inputs = undefined;
  request.session.errors = undefined;

  response.render('auth-login.ejs', data);
};

/*** RESET PASSWORD ***/

exports.resetPassword = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Reset password'
    },
    inputs: request.session.inputs,
    errors: request.session.errors,
    isEmailSent: request.session.isEmailSent
  };

  request.session.inputs = undefined;
  request.session.errors = undefined;
  request.session.isEmailSent = undefined;

  response.render('auth-reset-password.ejs', data);
};

/*** NEW PASSWORD ***/

exports.newPassword = (request, response, next) => {
  const newPassword = new NewPassword();
  newPassword.tokenValidation(request.params.token)
  .then(result => {
    if (result.length === 0) {
      response.redirect('/reset-password');
    } else if (result[0].expire_date < parseInt(Date.now() / 1000)) {
      // deleting old token
      newPassword.deleteToken();
      response.redirect('/reset-password');
    } else {
      let data = {
        html: {
          title: 'Playfab | New password'
        },
        email: result[0].email,
        token: result[0].token,
        inputs: request.session.inputs,
        errors: request.session.errors,
        isPasswordChanged: request.session.isPasswordChanged
      };

      request.session.inputs = undefined;
      request.session.errors = undefined;
      request.session.isPasswordChanged = undefined;

      response.render('auth-new-password.ejs', data);
    }
  })
  .catch( error => console.log(error));
};

/*** PROTECTED ROUTES ***/

/*** USER PROFILE ***/

exports.profileName = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Change name'
    }
  };

  response.render('profile-name.ejs', data);
};

/*** USER PROFILE SETTINGS ***/

exports.profileSettings = (request, response, next) => {
  let data = {
    html: {
      title: 'Playfab | Profile settings'
    },
    errors: request.session.errors
  };

  request.session.errors = undefined;

  response.render('profile-settings.ejs', data);
};

/*** USER PROFILE DELETE ***/

exports.profileDelete = (request, response, next) => {
  const form = new DeleteUser(response.locals.user);
  form.checkStep()
  .then(result => {
    if (result.length === 0 || result[0].expire_date < parseInt(Date.now() / 1000)) {
      // deleting old code id date expires
      form.deleteCode();
      let data = {
        html: {
          title: 'Playfab | Profile delete'
        },
        isEmailSent: false
      };

      request.session.isCodeCorrect = undefined;
      
      response.render('profile-delete.ejs', data);

    } else {
      let data = {
        html: {
          title: 'Playfab | Profile delete'
        },
        inputs: request.session.inputs,
        errors: request.session.errors,
        isEmailSent: true
      };
      if (request.session.isCodeCorrect === true) data.isCodeCorrect = true;

      request.session.inputs = undefined;
      request.session.errors = undefined;

      response.render('profile-delete.ejs', data);
    }
  })
  .catch(error => console.log('profile delete form', error));
};