// custom modules
const Database = require('../app/database.class');


class NewPassword {

  // private fields
  #userEmail;
  #token;
  #userPass;
  #passConf;
  
  // public fields
  isFormValid = true;
  errors = {
    userPass: '',
    passConf: '',
    passUniq: ''
  }

  constructor() {
    this.database = new Database();
  }

  setUserData(formData) {
    this.#userEmail = formData.userEmail;
    this.#token = formData.token;
    this.#userPass = formData.userPass;
    this.#passConf = formData.passConf;
  }

  tokenValidation(token) {
    const query = "SELECT * FROM new_password WHERE token = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, token, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  passValidation() {
    try {
      if (this.#userPass.length === 0) throw 'Please enter a password.';
      else if (this.#userPass.length < 8) throw 'Password does not meet requirements.';
      else if (/[^\w]/.test(this.#userPass)) throw 'Password does not meet requirements.';
      else if (!/(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9_])/.test(this.#userPass)) throw 'Password does not meet requirements.';
    } catch (error) {
      this.errors.userPass = error;
      this.isFormValid = false;
    }
  }

  passConfirmation() {
    try {
      if (this.#passConf.length === 0) throw 'Please confirm the password.';
      if (this.#passConf !== this.#userPass) throw 'Passwords are not the same.';
    } catch (error) {
      this.errors.passConf = error;
      this.isFormValid = false;
    }
  }

  passUniquenessValidation() {
    const query = "SELECT * FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#userEmail, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  passUpdate(hashedPass) {
    const query = "UPDATE users SET pass = ? WHERE email = ?";
    let values = [
      hashedPass,
      this.#userEmail
    ];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Password changed');
      });
    });
  }

  deleteToken(emailSelector = null) {
    let email = emailSelector != null ? emailSelector : this.#userEmail;
    const query = "DELETE FROM new_password WHERE email = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, email, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Token deleted');
      });
    });
  }
}

module.exports = NewPassword;