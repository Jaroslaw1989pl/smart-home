// build-in modules
const mysql = require('mysql2');
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

  connect() {
    this.connection.connect((error) => {
      if (error) throw error;
      else console.log('Connection to the db was successful');
    });
  }

  disconnect() {
    this.connection.end(() => {
      console.log('Connection with the db was closed');
    });
  }
}

module.exports = Database;