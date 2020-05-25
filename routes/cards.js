const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getCards, createCard, deleteCard } = require('../controllers/cards');

router.get('/', getCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/^http[s]?:\/\/(www\.)?(?!(www\.))((\d{1,3}\.){3}\d{1,3}(:\d{2,5})?|([a-z-]+(\.|:\d{2,5}))+)(\/?)(([a-zA-Z0-9-]{1,}?\/?)*#?)?$/i),
  }),
}), createCard);
router.delete('/:cardId', deleteCard);

module.exports = router;
