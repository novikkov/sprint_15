const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      res.send({
        token: jwt.sign({ _id: user._id }, 'key-key-key', { expiresIn: '7d' }),
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res
      .status(500)
      .send({ message: 'Ошибка при загрузке пользователей' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        res.status(404).send({ message: `Пользователя с данным id: ${req.params.userId} не существует` });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};


module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (password.length > 7 && password.match(/[a-z0-9]/i)) {
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
      .catch((err) => next(err));
  } else {
    res.status(400).send({ message: 'Короткий или не правильный формат пароля' });
  }
};
