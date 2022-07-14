// build-in modules
const dotEnv = require('dotenv').config();
const path = require('path');


exports.PORT = process.env.PORT;

exports.ROOT_DIR = path.join(__dirname, '..');

exports.dbConfig = {
  host: process.env.DB_HOST,
  name: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS
};