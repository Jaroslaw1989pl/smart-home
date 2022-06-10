// custom modules
const Database = require('./../app/database.class');

class BirthdayUpdate {

  // private fields
  #userId;
  #birthDate;

  // public fields
  errors = {
    date: ''
  };

  constructor() {
    this.database = new Database();
  }

  setData(formData) {
    this.#userId = formData.userId;
    this.#birthDate = formData.birthDate;
  }

  getLastUpdate(userId) {
    const query = "SELECT birthday, birthday_update FROM users_profiles WHERE user_id = ?";
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, userId, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  birthDateValidation() {
    const actualDate = new Date();
    // const date = '2022-06-24';
    try {
      if (this.#birthDate.length === 0) throw 'Incorrect date';
      if (parseInt(actualDate.getTime() / 1000) < parseInt(new Date(this.#birthDate).getTime() / 1000)) throw 'Incorrect date';

      const year = parseInt(this.#birthDate.slice[0]);
      const month = parseInt(this.#birthDate.slice[1]);
      const day = parseInt(this.#birthDate.slice[2]);
      
      if (year < 1900 || year > 2022) throw 'Incorrect date';
      if (month < 1 || month > 12) throw 'Incorrect date';
      if (day < 1 || day > 31) throw 'Incorrect date';
      
      return true;
    } catch (error) {
      this.errors.date = error;
      return false
    }
  }

  saveBirthDate() {
    const query = "UPDATE users_profiles SET birthday = ?, birthday_update = ? WHERE user_id = ?";
    const values = [
      this.#birthDate,
      parseInt(Date.now() / 1000),
      this.#userId
    ];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  deleteBirthDate() {
    const query = "UPDATE users_profiles SET birthday = ? WHERE user_id = ?";
    const values = [null, this.#userId];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}

module.exports = BirthdayUpdate;