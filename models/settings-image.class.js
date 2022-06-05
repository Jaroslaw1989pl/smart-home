// build-in modules
const fs = require('fs');
// custom modules
const Database = require('./../app/database.class');


class ImageUpload {

  // public fields
  #size;
  #mimetype;
  #oldPath;
  #newPath;
  #actualPath;
  errors;

  constructor(formData) {
    this.database = new Database();
    this.#size = formData.size;
    this.#mimetype = formData.mimetype;
    this.#oldPath = formData.oldPath;
    this.#newPath = formData.newPath;
    this.#actualPath = formData.actualPath;
  }
  
  validation() {
    try {
      if (this.#size === 0) throw 'Please select any image.';
      else if (this.#mimetype != 'image/jpeg' && this.#mimetype != 'image/png') throw 'Allowed image formats: JPG, JPEG, PNG.';
      else if (this.#size > 1500000) throw 'Image is too big (allowed size 1.5 MB).';
      else return true;
    } catch(error) {
      this.errors = error;
      return false;
    }
  }

  saveInFileSystem() {
    if (fs.existsSync(this.#actualPath)) {
      fs.unlink(this.#actualPath, (error) => {
        if (error) console.log('error durng removing actual avatar file', error);
      });
    }
    fs.rename(this.#oldPath, 'public' + this.#newPath, () => {
      console.log("Avatar uploaded.");
    });
  }

  saveInDatabase(userId) {
    const query = "UPDATE users_profiles SET avatar = ? WHERE user_id = ?";
    let values = [this.#newPath, userId];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(`Avatar for user id ${userId} updated.`);
      });
    });
  }
}

module.exports = ImageUpload;