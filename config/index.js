const {
  NODE_ENV,
  JWT_SECRET_KEY,
  PORT,
  SECRET_KEY,
} = process.env;

module.exports = {
  PORT: PORT || 3000,
  JWT_SECRET_KEY: NODE_ENV === 'production' ? JWT_SECRET_KEY : SECRET_KEY,
  SERVER_CONNECT: 'mongodb://localhost:27017/mestodb',
};
