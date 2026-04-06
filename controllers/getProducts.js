const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' }; // case-insensitive

    let products = await Product.find(filter);

    // Apply sorting
    if (sort === 'price-asc') products = products.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') products = products.sort((a, b) => b.price - a.price);

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

module.exports = { getProducts };
