// custom modules
const Database = require('../app/database.class');
const Email = require('./email.class');

class EmailUpdate {

  // private fields
  #userId;
  #oldEmail;
  #newEmail;
  #code;
  #userPass;

  // public fields
  isFormValid = true;
  errors = {
    code: '',
    newEmail: '',
    password: ''
  };

  constructor(user) {
    this.database = new Database();
    this.#userId = user.id;
    this.#oldEmail = user.email;
  }

  getLastUpdate() {
    const query = "SELECT email_update FROM users WHERE id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#userId, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  checkStep() {
    const query = "SELECT * FROM new_email WHERE old_email = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#oldEmail, (error, result, felds) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  createCode() {
    this.#code = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  }

  saveCode() {
    const query = "INSERT INTO new_email (old_email, code, expire_date) VALUES (?, ?, ?)";
    let values = [
      this.#oldEmail,
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
    const query = "DELETE FROM new_email WHERE old_email = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#oldEmail, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Code deleted');
      });
    });
  }

  sendCode() {
    const subject = 'Email change verification code';
    const message = `<p>Use this code: ${this.#code} to confirm your identity.</p>`;
    const email = new Email();
    email.send(this.#oldEmail, subject, message);
  }

  validateCode() {
    try {
      if (this.#code.length !== 5) throw 'Confirmation code must contain 5 digits.';
      else return true;
    } catch (error) {
      this.errors.code = error;
      return false;
    }
  }

  findCode() {
    const query = "SELECT * FROM new_email WHERE old_email = ? AND code = ?";
    let values = [this.#oldEmail, this.#code];
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
    this.#newEmail = formData.newEmail;
    this.#userPass = formData.userPass;
  }

  validateEmail() {
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    try {
      if (this.#newEmail.length === 0) throw 'Please enter new email address.';
      else if (!emailRegex.test(this.#newEmail)) throw 'That\'s an invalid email.';
      else if (this.#newEmail === this.#oldEmail) throw 'New email address can not be the same as actual.'
      else return true;
    } catch (error) {
      this.errors.newEmail = error;
      return false;
    }
  }

  findEmail() {
    const query = "SELECT email FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
      if (this.validateEmail()) {
        this.database.connection.query(query, this.#newEmail, (error, result, fields) => {
          if (error) reject(error);
          else resolve(result);
        });
      } else resolve(false);
    });
  }

  validatePassword() {
    try {
      if (this.#userPass.length === 0) throw 'Please enter a password.';
      else if (this.#userPass.length < 3) throw 'Incorrect password.';
      else if (/[^\w]/.test(this.#userPass)) throw 'Password does not meet requirements.';
      else return true;
    } catch (error) {
      this.errors.password = error;
      return false;
    }
  }

  verifyPassword() {
    const query = "SELECT * FROM users WHERE id = ?";
    return new Promise ((resolve, reject) => {
      if (this.validatePassword()) {
        this.database.connection.query(query, this.#userId, (error, result, fields) => {
          if (error) reject(error);
          else resolve(result);
        });
      } else resolve(false);
    });
  }

  updateEmail() {
    const query = "UPDATE users SET email = ?, email_update = ? WHERE id = ?";
    const values = [
      this.#newEmail,
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

module.exports = EmailUpdate;