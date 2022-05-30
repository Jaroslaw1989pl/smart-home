// 3rd party modules
const formidable = require('formidable');
// custom modules
const ImageUpload = require('./../models/settings-image-model');


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
      }
    }
    response.redirect('/profile-settings');
  });
};

exports.profileName = (request, response, next) => {
  let formData = {
    name: request.body.username,
    gold: response.locals.user.gold,
    priceAccept: request.body.priceAccept
  }
};