// custom modules
const Database = require('./../app/database.class');

class BirthdayUpdate {

  constructor() {
    this.database = new Database();
  }

}

module.exports = BirthdayUpdate;