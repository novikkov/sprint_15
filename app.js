require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { PORT, SERVER_CONNECT } = require('./config');

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(limiter);

mongoose.connect(SERVER_CONNECT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().regex(/^http[s]?:\/\/(www\.)?(?!(www\.))((\d{1,3}\.){3}\d{1,3}(:\d{2,5})?|([a-z-]+(\.|:\d{2,5}))+)(\/?)(([a-zA-Z0-9-]{1,}?\/?)*#?)?$/i),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).regex(/[a-zA-Z0-9]/i),
  }),
}), createUser);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).regex(/[a-zA-Z0-9]/i),
  }),
}), login);

app.use(auth);

app.use('/cards', require('./routes/cards'));
app.use('/users', require('./routes/users'));

app.use(errorLogger);

app.use(errors());

app.use('/', (req, res, next) => {
  res.status(404).json({ message: 'Запрашиваемый ресурс не найден' });
  next();
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
