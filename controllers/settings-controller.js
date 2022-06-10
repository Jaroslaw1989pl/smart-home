// 3rd party modules
const formidable = require('formidable');
const bcrypt = require('bcryptjs');
// custom modules
const ImageUpload = require('./../models/settings-image.class');
const NameUpdate = require('./../models/settings-name.class');
const BirthdayUpdate = require('./../models/settings-birthday.class');
const EmailUpdate = require('../models/settings-email.class');
const PasswordUpdate = require('../models/settings-password');


exports.profileAvatar = (request, response, next) => {
  const form = new formidable.IncomingForm();
  form.parse(request, (error, fields, files) => {
    if (error) console.log(error);
    else {
      let formData = {
        size: files.image.size,
        mimetype: files.image.mimetype,
        oldPath: files.image.filepath,
        newPath: `/assets/img/profile-avatars/${files.image.newFilename}.${files.image.mimetype.split('/')[1]}`,
        actualPath: 'public' + response.locals.user.avatar
      };
      const imageForm = new ImageUpload(formData);
      // validate image
      if (!imageForm.validation()) {
        request.session.errors = imageForm.errors;
      } else {
        imageForm.saveInFileSystem();
        imageForm.saveInDatabase(response.locals.user.id);
        response.locals.user.avatar = formData.newPath;
        request.session.flash = {success: 'Avatar updated.'};
      }
    }
    response.redirect('/profile-settings');
  });
};

exports.profileName = (request, response, next) => {
  let formData = {
    userId: response.locals.user.id,
    oldName: response.locals.user.name,
    newName: request.body.userName,
    gold: response.locals.user.gold,
    isPriceAccepted: request.body.isPriceAccepted ? true : false
  }

  const form = new NameUpdate();
  form.setUserData(formData);

  request.session.inputs = request.body;

  if (form.nameValidation()) {
    form.getUserName()
    .then(result => {
      if (result.length > 0) {
        form.formValidation();
        form.errors.userName = 'User name already taken.';
        request.session.errors = form.errors;
        response.redirect('/profile-name');
      } else if (result.length === 0 && !form.formValidation()) {
        request.session.errors = form.errors
        response.redirect('/profile-name');
      } else if (result.length === 0 && form.formValidation()) {
        form.nameUpdate()
        .then(() => {
          form.goldUpdate();
          form.spaceUpdate();
          response.locals.user.name = formData.newName;
          response.locals.user.gold = formData.gold - 100;
          return response.redirect('/profile-settings');
        })
        .catch(error => console.log(error));
      }
    })
    .catch(error => console.log(error));
  } else {
    form.formValidation();
    request.session.errors = form.errors;
    response.redirect('/profile-name');
  }
};

exports.profileBirthday = (request, response, next) => {
  const form = new BirthdayUpdate();

  let formData = {
    userId: response.locals.user.id,
    birthDate: request.body.userBirthday
  };

  form.setData(formData);

  if (request.body.setSubmitBtn) {
    if (form.birthDateValidation()) {
      form.saveBirthDate();
      response.locals.user.birthday = formData.birthDate;
    } else {
      request.session.errors = form.errors;
      response.redirect('/profile-birthday');
    }
  } else if (request.body.delSubmitBtn) {
    form.deleteBirthDate();
    response.locals.user.birthday = null;
  }
  
  response.redirect('/profile-settings');
};

exports.profileEmail = (request, response, next) => {
  
  const form = new EmailUpdate(response.locals.user);

  if (request.body.emailSubmitBtn) {
    form.deleteCode();
    form.createCode();
    form.saveCode()
    .then(() => {
      // form.sendCode();
      response.redirect('/profile-email');
    })
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
      // if (result === false) form.isFormValid = false;
      if (Array.isArray(result) && result.length > 0) {
        form.isFormValid = false;
        form.errors.newEmail = 'Email addres already in use.';
      } 
      return form.verifyPassword();
    })
    .then(result => {
      if (Array.isArray(result) && result.length > 0) return bcrypt.compare(formData.userPass, result[0].user_password);
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
      }

      if (typeof match !== 'undefined' && !match) form.errors.password = 'Incorrect password.';

      request.session.errors = form.errors;
      request.session.inputs = formData;
      response.redirect('/profile-email');
    })
    .catch(error => console.log('settings-controller.js => profileEmail()', error));   
  }
};

exports.profilePassword = (request, response, next) => {
  
  const form = new PasswordUpdate(response.locals.user);

  if (request.body.emailSubmitBtn) {
    form.deleteCode();
    form.createCode();
    form.saveCode()
    .then(() => {
      // form.sendCode();
      response.redirect('/profile-password');
    })
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
      if (Array.isArray(result) && result.length > 0) return bcrypt.compare(formData.userPass, result[0].user_password);
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