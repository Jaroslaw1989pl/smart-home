// 3rd party modules
const bcrypt = require('bcryptjs');
// custom modules
const Registration = require('./../models/auth-registration.class');
const Login = require('./../models/auth-login.class');
const User = require('./../models/user.class');
const ResetPassword = require('./../models/auth-password-reset.class');
const NewPassword = require('./../models/auth-password-new.class');
const DeleteUser = require('./../models/auth-delete.class');


/*** USER REGISTRATION ***/

exports.findUserName = (request, response, next) => {
  const form = new Registration();
  form.getUserName(request.query.userName)
  .then(data => {
    if (data.length > 0) response.send(true);
    else response.send(false);
  })
  .catch(error => console.log(error));
};

exports.findUserEmail = (request, response, next) => {
  const form = new Registration();
  form.getUserEmail(request.query.userEmail)
  .then(data => {
    if (data.length > 0) response.send(true);
    else response.send(false);
  })
  .catch(error => console.log(error));
};

exports.registration = (request, response, next) => {
  let formData = {
    userName: request.body.userName,
    userEmail: request.body.userEmail,
    userPass: request.body.userPass,
    passConf: request.body.passConf,
    userAvatar: request.body.avatar || null
  };

  const form = new Registration();

  form.setUserData(formData);

  // 1. validating user inputs
  form.nameValidation();
  form.emailValidation();
  form.passValidation();
  form.passConfirmation();
  form.avatarVerification();
  
  // 2. verifying user name uniqueness
  form.getUserName(request.body.userName)
  .then(data => {
    if (data.length > 0) {
      form.errors.userName = 'User name already taken.';
      form.isFormValid = false;
    }
    // 3. verifying user name uniqueness
    return form.getUserEmail(request.body.userEmail);
  })
  .then(data => {
    if (data.length > 0) {
      form.errors.userEmail = 'Email address already taken.';
      form.isFormValid = false;
    }
  })
  .then(() => {
    if (!form.isFormValid) {
      request.session.errors = form.errors;
      request.session.inputs = formData;
      response.redirect('/registration');
    } else {
      // 4. hashing password
      bcrypt.hash(formData.userPass, 12)
      .then(hashedPass => {
        formData.userPass = hashedPass;
        const user = new User();
        user.addUser(formData);
      })
      .then(() => {
        request.session.isRegistrationCompleted = true;
        response.redirect('/registration');
      })
      .catch(error => console.log(error));;
    }
  })
  .catch(error => console.log(error));
};

/*** USER LOGIN ***/

exports.login = (request, response, next) => {
  let formData = {
    userEmail: request.body.userEmail,
    userPass: request.body.userPass,
  };

  const form = new Login();
  
  form.setUserData(formData);
  form.findUser()
  .then(result => {
    if (result.length === 0) {
      request.session.errors = 'Invalid email or password.';
      request.session.inputs = formData;
      response.redirect('/login');
    } else {
      bcrypt.compare(formData.userPass, result[0].pass)
      .then(match => {
        if (match) {
          const user = new User();
          user.getUser(result[0].id)
          .then(result => {
            request.session.user = user.setUser(result[0]);
            request.session.isLoggedIn = true;
            response.redirect('/');
          })
          .catch(error => console.log(error));
        } else {
          request.session.errors = 'Invalid username or password.';
          request.session.inputs = formData;
          response.redirect('/login');
        }
      })
      .catch(error => console.log(error));
    }
  })
  .catch(error => console.log(error));
};

/*** USER LOGOUT ***/

exports.logout = (request, response, next) => {
  request.session.destroy();
  response.redirect('/');
};

/*** USER DELETE ***/

exports.delete = (request, response, next) => {
  const form = new DeleteUser(response.locals.user);
  
  if (request.body.emailSubmitBtn) {
    // creating code and sending email
    form.createCode();
    form.saveCode()
    .then(() => {
      form.sendCode();
      response.redirect('/profile-delete');
    })
    .catch(error => console.log('Sending delete account confirmation code', error));
  } else if (request.body.codeSubmitBtn) {
    // verifying code
    if (form.validateCode(request.body.code)) {
      form.findCode(request.body.code)
      .then(result => {
        if (result.length === 0) {
          request.session.errors = {code: 'Invalid code.'};
          request.session.inputs = request.body.code;
        } else {
          request.session.isCodeCorrect = true;
        }
        response.redirect('/profile-delete');
      })
      .catch(error => console.log('verifying delete profile code', error));
    } else {
      request.session.errors = form.errors;
      request.session.inputs = request.body.code;
      response.redirect('/profile-delete');
    }
  } else if (request.body.deleteSubmitBtn) {
    // verifying password
    if (form.validatePassword(request.body.userPass)) {
      form.verifyPassword()
      .then(result => {
        if (result === 0) {
          // incorrect password
          request.session.errors = {password: 'Incorrect password.'};
          request.session.inputs = request.body.userPass;
          response.redirect('/profile-delete');
        } else {
          bcrypt.compare(request.body.userPass, result[0].user_password)
          .then(match => {
            if (match) {
              // correct password
              const user = new User();
              user.deleteUser(response.locals.user.id);
              user.deleteSpace(response.locals.user.name);
              user.deleteAvatar(response.locals.user.avatar);
              form.deleteCode();
              request.session.flash = {success: 'Profile deleted.'};
              request.session.user = undefined;
              request.session.isLoggedIn = undefined;
              request.session.isCodeCorrect = undefined;
              response.redirect('/');
            } else {
              request.session.errors = {password: 'Incorrect password.'};
              request.session.inputs = request.body.userPass;
              response.redirect('/profile-delete');
            }
          })
          .catch(error => console.log(error));
        }
      })
      .catch(error => console.log(error));
    } else {
      request.session.errors = form.errors;
      request.session.inputs = request.body.userPass;
      response.redirect('/profile-delete');
    }
  }
};

/*** RESET PASSWORD ***/

exports.resetPassword = (request, response, next) => {
  let formData = {
    userEmail: request.body.userEmail
  };
  
  const reset = new ResetPassword(formData);
  // 1. email address validation
  console.log('1');
  reset.emailValidation();
  console.log('3');
  if (reset.isFormValid) {
    // 2. verifying email address exists in database
    console.log('4');
    const form = new Registration();
    form.getUserEmail(formData.userEmail)
    .then(data => {
      if (data.length === 0) {
        request.session.errors = 'This email address is not associated with a personal user account';
        request.session.inputs = formData;
        response.redirect('/reset-password');
      } else {
        reset.deleteToken()
        .then(() => {
          reset.createToken();
          reset.sendEmail();
          request.session.isEmailSent = true;
          response.redirect('/reset-password');
        })
        .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
  } else {
    request.session.errors = reset.errors;
    request.session.inputs = formData;
    response.redirect('/reset-password');
  }
};

/*** NEW PASSWORD ***/

exports.newPassword = (request, response, next) => {
  let formData = {
    userEmail: request.body.userEmail,
    token: request.body.token,
    userPass: request.body.userPass,
    passConf: request.body.passConf
  };

  const form = new NewPassword();
  
  form.setUserData(formData);
  form.passValidation();
  form.passConfirmation();

  if (form.isFormValid) {
    form.passUniquenessValidation()
    .then(result => {
      return bcrypt.compare(formData.userPass, result[0].pass);
    })
    .then(match => {
      if (match) {
        form.errors.passUniq = 'The new password can not be the same as previous';
        request.session.errors = form.errors;
        request.session.inputs = formData;
        response.redirect('/reset-password/' + formData.token);
      } else {
        bcrypt.hash(formData.userPass, 12)
        .then((hashedPass) => {
          form.passUpdate(hashedPass);
          form.deleteToken();
          request.session.isPasswordChanged = true;
          response.redirect('/reset-password/' + formData.token);
        })
        .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
  } else {
    request.session.errors = form.errors;
    request.session.inputs = formData;
    response.redirect('/reset-password/' + formData.token);
  }
};