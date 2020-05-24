const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res
      .status(500)
      .send({ message: 'Ошибка при загрузке карточек' }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;

  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (card) {
        if (req.user._id.toString() === card.owner.toString()) {
          Card.deleteOne(card)
            .then(() => res.send({ message: 'Карточка успешно удалена' }));
        } else {
          res.status(403).send({ message: 'Нельзя удалить чужую карточку' });
        }
      } else {
        res.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};
