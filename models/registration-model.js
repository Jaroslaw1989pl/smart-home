// custom modules
const Database = require('./../app/database.class');

class Registration {

  constructor() {
    this.database = new Database();
  }

  getUserName(userName) {
    return new Promise((resolve, reject) => {
      resolve(this.database.selectData("SELECT * FROM users WHERE user_name = '" + userName + "'"));
    });
  }
}

module.exports = Registration;