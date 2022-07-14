// custom modules
const Database = require('../app/database.class');


class AvatarUpdate {

  // private fields
  #avatar;

  constructor(avatar) {
    this.database = new Database();
    this.#avatar = avatar;
  }

  saveInDatabase(userId) {
    const query = "UPDATE profiles SET avatar = ? WHERE user_id = ?";
    let values = [this.#avatar, userId];
    return new Promise((resolve, reject) => {
      this.database.connection.query(query, values, (error, result, fields) => {
        if (error) reject(error);
        else resolve(`Avatar for user id ${userId} updated.`);
      });
    });
  }
}

module.exports = AvatarUpdate;