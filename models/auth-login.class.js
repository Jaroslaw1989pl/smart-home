// custom modules
const Database = require('./../app/database.class');


class Login {

  // private fields
  #userEmail;
  #userPass;

  constructor() {
    this.database = new Database();
  }

  setUserData(formData) {
    this.#userEmail = formData.userEmail;
    this.#userPass = formData.userPass;
  }

  emailValidation() {
    const emailRegex = /^([\w]+[.|-]{0,1}[\w]+)+@([\w]+-{0,1}[\w]+\.)+[a-zA-Z]{2,3}$/i;
    try {
      if (this.#userEmail.length === 0) throw 'Please enter your email address.';
      else if (!emailRegex.test(this.#userEmail)) throw 'That\'s an invalid email.';
      else return true;
    } catch (error) {
      return false;
    }
  };

  passValidation() {
    try {
      if (this.#userPass.length === 0) throw 'Please enter a password.';
      else if (/[^\w]/.test(this.#userPass)) throw 'Password does not meet requirements.';
      else return true;
    } catch (error) {
      return false;
    }
  }

  findUser() {
    const query = "SELECT * FROM registrated_users WHERE user_email = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#userEmail, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}

module.exports = Login;