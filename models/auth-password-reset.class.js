// 3rd party modules
const crypto = require('crypto');
// custom modules
const config = require('./../app/config');
const Database = require('../app/database.class');
const Email = require('./email.class');


class ResetPassword {

  email;
  token;

  // public fields
  isFormValid = true;
  errors;

  constructor(formData) {
    this.database = new Database();
    this.email = formData.userEmail;
    crypto.randomBytes(32, (error, buffer) => {
      if (error) console.log(error);
      else this.token = buffer.toString('hex');
    });
  }

  emailValidation() {
    console.log('emailValidation - 0');
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    console.log('emailValidation - 1');
    try {
      console.log('emailValidation - 2');
      if (this.email.length === 0) {
        console.log('emailValidation - 3');
        throw 'Please enter your email address.';
      }
      else if (!emailRegex.test(this.email)) {
        console.log('emailValidation - 4');
        throw 'That\'s an invalid email.';
      }
    } catch (error) {
      console.log('emailValidation - 5');
      this.errors = error;
      this.isFormValid = false;
    }
  };

  createToken() {
    const query = "INSERT INTO new_password (email, token, expire_date) VALUES (?, ?, ?)";
    let values = [
      this.email,
      this.token,
      parseInt((Date.now() + 3600000) / 1000)
    ];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Token created');
      });
    });
  }

  deleteToken() {
    const query = "DELETE FROM new_password WHERE email = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.email, (error, result, fields) => {
        if (error) reject(error);
        else resolve('Token deleted');
      });
    });
  }

  sendEmail() {
    const subject = 'Password reset';
    const message = `
      <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:${config.PORT}/reset-password/${this.token}">link</a> to set a new password</p>
    `;
    const email = new Email();
    email.send(this.email, subject, message);
  }
}

module.exports = ResetPassword;