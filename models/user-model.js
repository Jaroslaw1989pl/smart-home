// bult-in modules
const fs = require('fs');
// custom modules
const Database = require('../app/database');

class User {

  constructor() {
    this.database = new Database();
  }

  addUser(formData) {

    let query = `INSERT INTO registrated_users (user_name, name_update, user_email, email_update, user_password, password_update) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    let values = [
      formData.userName,
      parseInt(Date.now() / 1000),
      formData.userEmail,
      parseInt(Date.now() / 1000),
      formData.userPass,
      parseInt(Date.now() / 1000),
    ];
    return new Promise((resolve, reject) => {
      // adding new user to database
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else {
          // getting new user id
          let query = `SELECT user_id FROM registrated_users WHERE user_name = ?`;
          this.database.connection.query(query, formData.userName, (error, result, fields) => {
            if (error) reject(error);
            else {
              // adding new user to other tables
              let query = `INSERT INTO users_profiles (user_id) VALUES (?)`;
              this.database.connection.query(query, result[0].user_id, (error, result, fields) => {
                if (error) reject(error);
                else resolve(result);
              });
            }
          });
        }
      });
    });
  }

  addSpace(name) {
    if (!fs.existsSync('spaces/' + name)) {
      fs.mkdir('spaces/' + name, error => console.log(error));
    }
  }

  getUser(userId) {
    const query = `SELECT * FROM registrated_users, users_profiles WHERE registrated_users.user_id = ? AND users_profiles.user_id = ?`;
    const values = [userId, userId];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  setUser(userData) {
    return {
      id: userData.user_id,
      name: userData.user_name,
      nameUpdate: userData.name_update,
      email: userData.user_email,
      emailUpdate: userData.email_update,
      passwordUpdate: userData.password_update,
      avatar: userData.avatar,
      birthday: userData.birthday,
      gold: userData.gold
    };
  }

  deleteUser(id) {
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