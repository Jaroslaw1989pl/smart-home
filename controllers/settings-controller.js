// 3rd party modules
const formidable = require('formidable');
const bcrypt = require('bcryptjs');
// custom modules
const AvatarUpdate = require('./../models/settings-avatar.class');
const NameUpdate = require('./../models/settings-name.class');
const EmailUpdate = require('../models/settings-email.class');
const PasswordUpdate = require('../models/settings-password');


exports.profileAvatar = (request, response, next) => {

  const form = new AvatarUpdate(request.body.avatar);
  form.saveInDatabase(response.locals.user.id)
  .then(result => {
    response.locals.user.avatar = request.body.avatar
    response.send(true);
  })
  .catch(error => console.log(error));
};

exports.profileName = (request, response, next) => {

  let formData = {
    oldName: response.locals.user.name,
    newName: request.body.userName
  }

  const form = new NameUpdate();
  form.setUserData(formData);

  request.session.inputs = request.body;

  if (form.nameValidation() === false) {
    request.session.errors = form.errors;
    response.redirect('/settings-name');
  } else {
    form.getUserName()
    .then(result => {
      if (result.length > 0) {
        form.errors.userName = 'User name already taken.';
        request.session.errors = form.errors;
        response.redirect('/settings-name');
      } else if (result.length === 0) {
        form.nameUpdate()
        .then(() => {
          response.locals.user.name = formData.newName;
          request.session.flash = {success: 'Name updated.'};
          response.redirect('/profile-settings');
        })
        .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
  }
};

exports.profileEmail = (request, response, next) => {
  
  const form = new EmailUpdate(response.locals.user);

  if (request.body.emailSubmitBtn) {

    form.deleteCode()
    .then(() => {
      form.createCode();
      form.saveCode();
    })
    .then(() => form.sendCode())
    .then(() => response.redirect('/profile-email'))
    .catch(error => console.log('settings-controller.js => profileEmail()', error));

  } else if (request.body.formSubmitBtn) {
    
    let formData = {
      code: request.body.code,
      newEmail: request.body.newEmail,
      userPass: request.body.userPass
    };

    form.setFormData(formData);

    form.findCode()
    .then(result => {
      if (Array.isArray(result) && result.length === 0) {
        form.isFormValid = false;
        form.errors.code = 'Incorrect code.';
      }
      return form.findEmail();
    })
    .then(result => {
      if (Array.isArray(result) && result.length > 0) {
        form.isFormValid = false;
        form.errors.newEmail = 'Email addres already in use.';
      } 
      return form.verifyPassword();
    })
    .then(result => {
      if (Array.isArray(result) && result.length > 0) return bcrypt.compare(formData.userPass, result[0].pass);
      else form.isFormValid = false;
    })
    .then(match => {
      if (match && form.isFormValid) {
        form.updateEmail()
        .then(() => {
          form.deleteCode();
          request.session.flash = {success: 'Email updated.'};
          return response.redirect('/profile-settings');
        })
        .catch(error => console.log('settings-controller.js => profileEmail()', error));
      } else {
        if (typeof match !== 'undefined' && !match) form.errors.password = 'Incorrect password.';
  
        request.session.errors = form.errors;
        request.session.inputs = formData;
        response.redirect('/profile-email');
      }

    })
    .catch(error => console.log('settings-controller.js => profileEmail()', error));   
  }
};

exports.profilePassword = (request, response, next) => {
  
  const form = new PasswordUpdate(response.locals.user);

  if (request.body.emailSubmitBtn) {
    form.deleteCode()
    .then(() => {
      form.createCode();
      form.saveCode();
    })
    .then(() => form.sendCode())
    .then(() => response.redirect('/profile-password'))
    .catch(error => console.log('settings-controller.js => profilePassword()', error));

  } else if (request.body.formSubmitBtn) {
    let formData = {
      code: request.body.code,
      newPass: request.body.userPass,
      newPassConf: request.body.passConf,
      userPass: request.body.actualUserPass
    };

    form.setFormData(formData);

    form.findCode()
    .then(result => {
      if (Array.isArray(result) && result.length === 0) {
        form.isFormValid = false;
        form.errors.code = 'Incorrect code.';
      }
      form.newPassValidation();
      form.newPassConfirmation();
      return form.verifyPassword();
    })
    .then(result => {
      if (Array.isArray(result) && result.length > 0) return bcrypt.compare(formData.userPass, result[0].pass);
      else form.isFormValid = false;
    })
    .then(match => {
      if (typeof match !== 'undefined' && !match) {
        form.isFormValid = false;
        form.errors.password = 'Incorrect password.';
      }
      if (match && formData.newPass === formData.userPass) {
        form.isFormValid = false;
        form.errors.newPass = 'New password can not be the same as actual.';
      }
    })
    .then(() => {
      if (form.isFormValid) {
        bcrypt.hash(formData.newPass, 12)
        .then(hashedPass => {
          form.updatePassword(hashedPass);
        })
        .then(() => {
          form.deleteCode();
          request.session.flash = {success: 'Password updated.'};
          return response.redirect('/profile-settings');
        })
        .catch(error => console.log('settings-controller.js => profilePassword()', error));
      } else {
        request.session.errors = form.errors;
        request.session.inputs = formData;
        response.redirect('/profile-password');
      }
    })
    .catch(error => console.log('settings-controller.js => profilePassword()', error));
  }
};