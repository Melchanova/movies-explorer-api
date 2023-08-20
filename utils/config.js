const { config } = require('dotenv');

const {
  NODE_ENV,
  SECRET_KEY_DEV = 'secret-word',
  DB_URL_DEV = 'mongodb://127.0.0.1:27017/bitfilmsdb',
} = process.env;

if (NODE_ENV === 'production') {
  config();
}

module.exports = {
  SECRET_KEY_DEV,
  DB_URL_DEV,
};
