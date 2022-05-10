// build-in modules
const mysql = require('mysql');
// custom modules
const { dbConfig } = require('./config/config');

class Database {
  
  constructor() {
    this.connection = mysql.createConnection({
      host: dbConfig.db_host,
      user: dbConfig.db_user,
      password: dbConfig.db_pass,
      database: dbConfig.db_name
    });
  }

  selectData(query) {
    return new Promise((resolve, reject) => {
      this.connection.connect((error) => {
        if (error) throw error;
        this.connection.query(query, (error, result, fields) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
    });
  }
}

module.exports = Database;