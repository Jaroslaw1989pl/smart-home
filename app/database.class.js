// 3rd party modules
const mysql = require('mysql2');
// custom modules
const { dbConfig } = require('./config');


class Database {
  
  constructor() {
    this.connection = mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.pass,
      database: dbConfig.name
    });
  }
}

module.exports = Database;