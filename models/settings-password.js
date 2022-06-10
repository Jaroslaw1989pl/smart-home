// custom modules
const Database = require('../app/database.class');
const Email = require('./email.class');

class PasswordUpdate {

  // private fields
  #userId;
  #userEmail;
  #code;
  #newPass;
  #newPassConf;
  #userPass;

  // public fields
  isFormValid = true;
  errors = {
    code: '',
    newPass: '',
    newPassConf: '',
    password: ''
  };

  constructor(user) {
    this.database = new Database();
    this.#userId = user.id;
    this.#userEmail = user.email;
  }

  getLastUpdate() {
    const query = "SELECT password_update FROM registrated_users WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#userId, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  checkStep() {
    const query = "SELECT * FROM reset_password WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#userId, (error, result, felds) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  createCode() {
    this.#code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  }

  saveCode() {
    const query = "INSERT INTO reset_password (user_id, code, expire_date) VALUES (?, ?, ?)";
    let values = [
      this.#userId,
      this.#code,
      parseInt((Date.now() + 3600000) / 1000)
    ];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Code saved in the database');
      });
    });
  }

  deleteCode() {
    const query = "DELETE FROM reset_password WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#userId, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Code deleted');
      });
    });
  }

  sendCode() {
    const subject = 'Email change verification code';
    const message = `<p>Use this code: ${this.#code} to confirm your identity.</p>`;
    const email = new Email();
    email.send(this.#userEmail, subject, message);
  }

  validateCode() {
    try {
      if (this.#code.length !== 5) throw 'Confirmation code must contain 5 digits.';
      return true;
    } catch (error) {
      this.errors.code = error;
      return false;
    }
  }

  findCode() {
    const query = "SELECT * FROM reset_password WHERE user_id = ? AND code = ?";
    let values = [this.#userId, this.#code];
    return new Promise((resolve, reject) => {
      if (this.validateCode()) {
        this.database.connection.query(query, values, (error, result, felds) => {
          if (error) reject(error);
          else resolve(result);
        });
      } else resolve(false);
    });
  }

  setFormData(formData) {
    this.#code = formData.code;
    this.#newPass = formData.newPass;
    this.#newPassConf = formData.newPassConf;
    this.#userPass = formData.userPass;
  }

  // new password validation

  newPassValidation() {
    try {
      if (this.#newPass.length === 0) throw 'Please enter a password.';
      else if (this.#newPass.length < 3) throw 'Password does not meet requirements.';
      else if (/[^\w]/.test(this.#newPass)) throw 'Password does not meet requirements.';
    } catch (error) {
      this.errors.newPass = error;
      this.isFormValid = false;
    }
  }

  newPassConfirmation() {
    try {
      if (this.#newPassConf.length === 0) throw 'Please confirm the password.';
      else if (this.#newPassConf !== this.#newPass) throw 'Passwords are not the same.';
    } catch (error) {
      this.errors.newPassConf = error;
      this.isFormValid = false;
    }
  }

  validatePassword() {
    try {
      if (this.#userPass.length === 0) throw 'Please enter a password.';
      else if (this.#userPass.length < 3) throw 'Incorrect password.';
      else if (/[^\w]/.test(this.#userPass)) throw 'Password does not meet requirements.';
      return true;
    } catch (error) {
      this.errors.password = error;
      return false;
    }
  }

  verifyPassword() {
    const query = "SELECT * FROM registrated_users WHERE user_id = ?";
    return new Promise ((resolve, reject) => {
      if (this.validatePassword()) {
        this.database.connection.query(query, this.#userId, (error, result, fields) => {
          if (error) reject(error);
          else resolve(result);
        });
      } else resolve(false);
    });
  }

  updatePassword(hashedPass) {
    const query = "UPDATE registrated_users SET user_password = ?, password_update = ? WHERE user_id = ?";
    const values = [
      hashedPass,
      parseInt(Date.now() / 1000),
      this.#userId
    ];
    return new Promise ((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }  
}

module.exports = PasswordUpdate;