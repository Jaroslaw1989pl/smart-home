// custom modules
const Database = require('./../app/database');
const Email = require('./email-model');

class DeleteUser {

  // private fields
  #userId;
  #userEmail;
  #code;

  // public fields
  errors = {
    code: '',
    password: ''
  };

  constructor(user) {
    this.database = new Database();
    this.#userId = user.id;
    this.#userEmail = user.email;
  }

  checkStep() {
    const query = "SELECT * FROM delete_profile WHERE user_id = ?";
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
    const query = "INSERT INTO delete_profile (user_id, user_email, code, expire_date) VALUES (?, ?, ?, ?)";
    let values = [
      this.#userId,
      this.#userEmail,
      this.#code,
      parseInt((Date.now() + 3600000) / 1000)
    ];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve('result');
      });
    });
  }

  deleteCode() {
    const query = "DELETE FROM delete_profile WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#userId, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Code deleted');
      });
    });
  }

  sendCode() {
    const subject = 'Peronal account delete code';
    const message = `<p>Use this code: ${this.#code} to confirm your identity.</p>`;
    const email = new Email();
    email.send(this.#userEmail, subject, message);
  }

  validateCode(code) {
    try {
      if (code.length !== 5) throw 'Confirmation code must contain 5 digits.';
      else return true;
    } catch (error) {
      this.errors.code = error;
      return false;
    }
  }

  findCode(code) {
    const query = "SELECT * FROM delete_profile WHERE user_id = ? AND code = ?";
    let values = [this.#userId, code];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, felds) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  validatePassword(password) {
    try {
      if (password.length === 0) throw 'Please enter a password.';
      if (password.length < 3) throw 'Incorrect password.';
      return true;
    } catch (error) {
      this.errors.password = error;
      return false;
    }
  }

  verifyPassword() {
    const query = "SELECT * FROM registrated_users WHERE user_id = ?";
    return new Promise ((resolve, reject) => {
      this.database.connection.query(query, this.#userId, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}

module.exports = DeleteUser;