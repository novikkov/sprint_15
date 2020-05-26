const { NODE_ENV, JWT_SECRET_KEY, PORT } = process.env;

module.exports = {
  PORT: PORT || 3000,
  JWT_SECRET_KEY: NODE_ENV === 'production' ? JWT_SECRET_KEY : 'secret-key',
  SERVER_CONNECT: 'mongodb://localhost:27017/mestodb',
};
