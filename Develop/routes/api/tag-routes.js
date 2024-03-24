const express = require('express');
const router = express.Router();
const { Tag, Product } = require('../../models');

const handleAsyncError = (callback) => {
  return async (req, res, next) => {
    try {
      await callback(req, res, next);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
};

router.get('/', handleAsyncError(async (req, res) => {
  const tags = await Tag.findAll({ include: [Product] });
  res.json(tags);
}));


router.get('/:id', handleAsyncError(async (req, res) => {
  const tag = await Tag.findByPk(req.params.id, { include: [Product] });
  if (!tag) {
    res.status(404).json({ message: 'No tag found with this id' });
    return;
  }
  res.json(tag);
}));

router.post('/', handleAsyncError(async (req, res) => {
  const tag = await Tag.create({ tag_name: req.body.tag_name });
  res.status(201).json(tag);
}));

router.put('/:id', handleAsyncError(async (req, res) => {
  const [num] = await Tag.update(req.body, { where: { id: req.params.id } });
  if (num === 1) {
    res.status(200).json({ message: 'Tag was updated successfully.' });
  } else {
    res.status(404).json({ message: `Cannot update Tag with id=${req.params.id}. Maybe Tag was not found or req.body is empty!` });
  }
}));

router.delete('/:id', handleAsyncError(async (req, res) => {
  const num = await Tag.destroy({ where: { id: req.params.id } });
  if (num === 1) {
    res.status(200).json({ message: 'Tag was deleted successfully!' });
  } else {
    res.status(404).json({ message: `Cannot delete Tag with id=${req.params.id}. Maybe Tag was not found!` });
  }
}));

module.exports = router;
