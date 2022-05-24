// bult-in modules
const fs = require('fs');
// custom modules
const Database = require('./../app/database.class');

class User {

  #id;
  #name;
  #nameUpdate;
  #email;
  #emailUpdate;
  #passwordUpdate;

  constructor() {
    this.database = new Database();
  }

  add(formData) {

    let query = "INSERT INTO registrated_users (user_name, name_update, user_email, email_update, user_password, password_update) VALUES (?, ?, ?, ?, ?, ?)";
    
    let values = [
      formData.userName,
      parseInt(Date.now() / 1000),
      formData.userEmail,
      parseInt(Date.now() / 1000),
      formData.userPass,
      parseInt(Date.now() / 1000),
    ];
    
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  addSpace(name) {
    if (!fs.existsSync('spaces/' + name)) {
      fs.mkdir('spaces/' + name, error => console.log(error));
    }
  }

  set(userData) {
    this.#id = userData.user_id;
    this.#name = userData.user_name;
    this.#nameUpdate = userData.name_update;
    this.#email = userData.user_email;
    this.#emailUpdate = userData.email_update;
    this.#passwordUpdate = userData.password_update;
  }

  get() {
    return {
      id: this.#id,
      name: this.#name,
      nameUpdate: this.#nameUpdate,
      email: this.#email,
      emailUpdate: this.#emailUpdate,
      passwordUpdate: this.#passwordUpdate
    };
  }

  delete(id) {
    const query = "DELETE FROM registrated_users WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, id, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  deleteSpace(name) {
    if (fs.existsSync('spaces/' + name)) {
      fs.rm('spaces/' + name, { recursive: true}, error => console.log(error));
    }
  }
}

module.exports = User;