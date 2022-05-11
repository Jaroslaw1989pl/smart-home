// custom modules
const Database = require('./../app/database.class');


class Registration {

  // private fields
  #userName;
  #userEmail;
  #userPass;
  #passConf;
  // public fields
  isFormValid = true;
  errors = {
    userName: '',
    userEmail: '',
    userPass: '',
    passConf: ''
  }

  constructor() {
    this.database = new Database();
  }

  setUserData(userName, userEmail, userPass, passConf) {
    this.#userName = userName;
    this.#userEmail = userEmail;
    this.#userPass = userPass;
    this.#passConf = passConf;
  }

  // getUserName(userName, callback) {
  //   const query = "SELECT user_name FROM registrated_users WHERE user_name = ?";
  //   this.database.query(query, userName)
  //   .then(result => callback(result))
  //   .catch(error => callback(error));
  // }

  getUserName(userName) {
    const query = "SELECT user_name FROM registrated_users WHERE user_name = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, userName, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  // getUserEmail(userEmail, callback) {
  //   const query = "SELECT user_email FROM registrated_users WHERE user_email = ?";
  //   this.database.query(query, userEmail)
  //   .then(result => callback(result));
  //   .catch(error => callback(error));
  // }

  getUserEmail(userEmail) {
    const query = "SELECT user_email FROM registrated_users WHERE user_email = ?";
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
      if (/[^\w]/.test(this.#userName)) throw 'The username can only contain Latin letters, numbers and underscore.';
      if (this.#userName.length < 3) throw 'The username should be at least 3 characters long.';
      if (this.#userName.length > 24) throw 'The username should not exceed 24 characters.';    
    } catch (error) {
      this.errors.userName = error;
      this.isFormValid = false;
    }
  }

  emailValidation() {
    
    const emailRegex = /^([\w]+[.|-]{0,1}[\w]+)+@([\w]+-{0,1}[\w]+\.)+[a-zA-Z]{2,3}$/i;

    try {
      if (this.#userEmail.length === 0) throw 'Please enter your email address.';
      if (!emailRegex.test(this.#userEmail)) throw 'That\'s an invalid email.';
    } catch (error) {
      this.errors.userEmail = error;
      this.isFormValid = false;
    }
  };

  passValidation() {
    try {
      if (this.#userPass.length === 0) throw 'Please enter a password.';
      if (/[^\w]/.test(this.#userPass)) throw 'Password does not meet requirements.';
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
}

module.exports = Registration;