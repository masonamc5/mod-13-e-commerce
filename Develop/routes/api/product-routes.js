const express = require('express');
const router = express.Router();
const { Tag, Product } = require('../../models');

router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [Tag],
    });
    res.status(200).json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [Tag],
    });
    if (!productData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving product with id=' + req.params.id });
  }
});

router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (updatedProduct[0] > 0) {
      res.status(200).json({ message: 'Product updated successfully' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const numDeleted = await Product.destroy({
      where: { id: req.params.id },
    });

    if (numDeleted > 0) {
      res.status(200).json({ message: 'Product was deleted successfully!' });
    } else {
      res.status(404).json({ message: `Cannot delete Product with id=${req.params.id}. Maybe Product was not found!` });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not delete Product with id=' + req.params.id });
  }
});

module.exports = router;
