// custom modules
const Database = require('./../app/database.class');
const Email = require('./email.class');

class EmailUpdate {
  
  constructor() {
    this.database = new Database();
  }

}

module.exports = EmailUpdate;