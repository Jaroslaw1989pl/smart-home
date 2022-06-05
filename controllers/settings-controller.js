// 3rd party modules
const formidable = require('formidable');
// custom modules
const ImageUpload = require('./../models/settings-image.class');
const NameUpdate = require('./../models/settings-name.class');

exports.profileAvatar = (request, response, next) => {
  const form = new formidable.IncomingForm();
  form.parse(request, (error, fields, files) => {
    if (error) console.log(error);
    else {
      let formData = {
        size: files.image.size,
        mimetype: files.image.mimetype,
        oldPath: files.image.filepath,
        newPath: `/assets/img/avatars/${files.image.newFilename}.${files.image.mimetype.split('/')[1]}`,
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
  let formData = {};
  console.log(request.body);
  // NIE DOKONCZONE!!!
  response.redirect('/profile-birthday');
};

exports.profileEmail = (request, response, next) => {
  let formData = {};
  console.log(request.body);
  // NIE DOKONCZONE!!!

  // 1. sprawdzenie czy został wysłany email czy został przesłany formularz
  if (request.body/*send email btn*/) {
    // 2. wygenerowanie kodu
    // 3. zapisanie kodu w bazie danych
    // 4. wysłanie kodo na aktualny email
    response.redirect('/profile-email');
  } else if (request.body/*update email btn*/) {
    // 2. weryfikacja kodu
    // 3. walidacja nowego adresu email
    // 4. weryfikcja hasła
    // 5. 
  }
};