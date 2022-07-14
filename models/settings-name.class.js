// build-in modules
const fs = require('fs');
// custom modules
const Database = require('../app/database.class');

class NameUpdate {

  // private fields
  #oldName;
  #newName;

  // public fields
  errors = {
    userName: ''
  };

  constructor() {
    this.database = new Database();
  }

  setUserData(formData) {
    this.#oldName = formData.oldName;
    this.#newName = formData.newName;
  }

  getLastUpdate(userId) {
    const query = "SELECT name_update FROM users WHERE id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, userId, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  getUserName() {
    const query = "SELECT name FROM users WHERE name = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, this.#newName, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  nameValidation() {
    try {
      if (this.#newName.length === 0) throw 'Please enter your user name.';
      else if (/[^\w]/.test(this.#newName)) throw 'The username can only contain Latin letters, numbers and underscore.';
      else if (this.#newName.length < 3) throw 'The username should be at least 3 characters long.';
      else if (this.#newName.length > 24) throw 'The username should not exceed 24 characters.';
      return true;
    } catch (error) {
      this.errors.userName = error;
      return false;
    }
  }

  nameUpdate() {
    const query = "UPDATE users SET name = ?, name_update = ? WHERE name = ?";
    const values = [
      this.#newName,
      parseInt(Date.now() / 1000),
      this.#oldName
    ];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}

module.exports = NameUpdate;