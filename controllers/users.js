const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET_KEY } = require('../config');
const NotFoundError = require('../errors/not-found-err');
const AuthError = require('../errors/auth-err');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, JWT_SECRET_KEY, { expiresIn: '7d' }),
      });
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError(`Пользователя с данным id: ${req.params.userId} не существует`))
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundError(`Пользователя с данным id: ${req.params.userId} не существует`);
      }
    })
    .catch(next);
};


module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.send({
      name,
      about,
      avatar,
      email,
    }))
    .catch(next);
};
