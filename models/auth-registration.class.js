// custom modules
const Database = require('./../app/database.class');


class Registration {

  // private fields
  #userName;
  #userEmail;
  #userPass;
  #passConf;
  #userAvatar;

  // public fields
  isFormValid = true;
  errors = {
    userName: '',
    userEmail: '',
    userPass: '',
    passConf: '',
    userAvatar: ''
  };

  constructor() {
    this.database = new Database();
  }

  setUserData(formData) {
    this.#userName = formData.userName;
    this.#userEmail = formData.userEmail;
    this.#userPass = formData.userPass;
    this.#passConf = formData.passConf;
    this.#userAvatar = formData.userAvatar;
  }

  getUserName(userName) {
    const query = "SELECT name FROM users WHERE name = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, userName, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  getUserEmail(userEmail) {
    const query = "SELECT email FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, userEmail, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  nameValidation() {
    try {
      if (this.#userName.length === 0) throw 'Please enter your user name.';
      else if (/[^\w]/.test(this.#userName)) throw 'The username can only contain Latin letters, numbers and underscore.';
      else if (this.#userName.length < 3) throw 'The username should be at least 3 characters long.';
      else if (this.#userName.length > 24) throw 'The username should not exceed 24 characters.';    
    } catch (error) {
      this.errors.userName = error;
      this.isFormValid = false;
    }
  }

  emailValidation() {
    
    const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

    try {
      if (this.#userEmail.length === 0) throw 'Please enter your email address.';
      else if (!emailRegex.test(this.#userEmail)) throw 'That\'s an invalid email.';
    } catch (error) {
      this.errors.userEmail = error;
      this.isFormValid = false;
    }
  };

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
      else if (this.#passConf !== this.#userPass) throw 'Passwords are not the same.';
    } catch (error) {
      this.errors.passConf = error;
      this.isFormValid = false;
    }
  }

  avatarVerification() {
    if (!this.#userAvatar) {
      this.errors.userAvatar = 'Please select your avatar.';
      this.isFormValid = false;
    }
  }
}

module.exports = Registration;