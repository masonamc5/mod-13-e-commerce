const express = require('express');
const router = express.Router();
const { Category, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [Product],
    });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [Product],
    });
    if (!category) {
      res.status(404).json({ message: 'No category found with this id' });
      return;
    }
    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  try {
    const category = await Category.create({
      category_name: req.body.category_name,
    });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const num = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (num == 1) {
      res.status(200).json({ message: 'Category was updated successfully.' });
    } else {
      res.status(404).json({ message: `Cannot update Category with id=${req.params.id}. Maybe Category was not found or req.body is empty!` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating Category with id=' + req.params.id });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const num = await Category.destroy({
      where: { id: req.params.id },
    });
    if (num == 1) {
      res.status(200).json({ message: 'Category was deleted successfully!' });
    } else {
      res.status(404).json({ message: `Cannot delete Category with id=${req.params.id}. Maybe Category was not found!` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete Category with id=' + req.params.id });
  }
});

module.exports = router;
