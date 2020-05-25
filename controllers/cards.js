const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const PermissionError = require('../errors/permission-err');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const owner = req.user._id;

  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (req.user._id.toString() === card.owner.toString()) {
          Card.deleteOne(card)
            .then(() => res.send({ message: 'Карточка успешно удалена' }));
        } else {
          throw new PermissionError('Нельзя удалить чужую карточку');
        }
      } else {
        throw new NotFoundError('Карточка не найдена');
      }
    })
    .catch(next);
};
