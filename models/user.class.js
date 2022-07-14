// bult-in modules
const fs = require('fs');
// custom modules
const Database = require('./../app/database.class');

class User {

  constructor() {
    this.database = new Database();
  }

  addUser(formData) {
    const query = `INSERT INTO users (name, name_update, email, email_update, pass, pass_update) 
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
          const query = `SELECT id FROM users WHERE name = ?`;
          this.database.connection.query(query, formData.userName, (error, result, fields) => {
            if (error) reject(error);
            else {
              // adding new user to other tables
              const query = `INSERT INTO profiles (user_id, avatar) VALUES (?, ?)`;
              let values = [result[0].id, formData.userAvatar];
              this.database.connection.query(query, values, (error, result, fields) => {
                if (error) reject(error);
                else resolve(result);
              });
            }
          });
        }
      });
    });
  }

  getUser(userId) {
    const query = `SELECT * FROM profiles, users WHERE profiles.user_id = ? AND users.id = ?`;
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
      id: userData.id,
      name: userData.name,
      nameUpdate: userData.name_update,
      email: userData.email,
      emailUpdate: userData.email_update,
      passwordUpdate: userData.pass_update,
      avatar: userData.avatar,
    };
  }

  deleteUser(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM profiles WHERE user_id = ?";
      this.database.connection.query(query, id, (error, result, fields) => {
        if (error) reject(error);
        else {
          const query = "DELETE FROM users WHERE id = ?";
          this.database.connection.query(query, id, (error, result, fields) => {
            if (error) reject(error);
            else resolve(result);
          });
        }
      });
    });
  }
}

module.exports = User;