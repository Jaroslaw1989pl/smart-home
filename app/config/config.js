// build-in modules
const dotEnv = require('dotenv').config();
const path = require('path');

// github repository: https://github.com/Jaroslaw1989pl/playfab.git

exports.port = 3000;

exports.dbConfig = {
  'db_host': process.env.DB_HOST,
  'db_name': process.env.DB_NAME,
  'db_user': process.env.DB_USER,
  'db_pass': process.env.DB_PASS
};

exports.ROOT_DIR = path.join(__dirname, '..', '..');