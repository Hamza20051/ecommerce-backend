const Product = require('../models/Product');

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      sort,
      priceMin,
      priceMax,
      rating,
    } = req.query;

    let filter = {};

    // 🔍 SEARCH
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // 📦 CATEGORY
    if (category) {
      filter.category = category;
    }

    // 💰 PRICE FILTER
    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = Number(priceMin);
      if (priceMax) filter.price.$lte = Number(priceMax);
    }

    // ⭐ RATING FILTER
    if (rating) {
      filter.ratings = { $gte: Number(rating) };
    }

    // 🔥 BUILD QUERY
    let query = Product.find(filter);

    // 📊 SORTING (FIXED: done in MongoDB)
    if (sort === 'price-asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      query = query.sort({ price: -1 });
    } else if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;

    res.json(products);

  } catch (error) {
    console.error('Get Products Error:', error);
    res.status(500).json({
      message: 'Error fetching products',
    });
  }
};

module.exports = { getProducts };
