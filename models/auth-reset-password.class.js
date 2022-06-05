// 3rd party modules
const crypto = require('crypto');
// custom modules
const Database = require('./../app/database.class');
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
    const emailRegex = /^([\w]+[.|-]{0,1}[\w]+)+@([\w]+-{0,1}[\w]+\.)+[a-zA-Z]{2,3}$/i;

    try {
      if (this.email.length === 0) throw 'Please enter your email address.';
      if (!emailRegex.test(this.email)) throw 'That\'s an invalid email.';
    } catch (error) {
      this.errors = error;
      this.isFormValid = false;
    }
  };

  createToken() {
    const query = "INSERT INTO reset_password (email, token, expire_date) VALUES (?, ?, ?)";
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
    const query = "DELETE FROM reset_password WHERE email = ?";
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
      <p>Click this <a href="http://localhost:3002/reset-password/${this.token}">link</a> to set a new password</p>
    `;
    const email = new Email();
    email.send(this.email, subject, message);
  }
}

module.exports = ResetPassword;