const Product = require('../models/Product');

// ==========================
// GET ALL PRODUCTS (Public)
// ==========================
const getProducts = async (req, res) => {
  try {
    const { search, sort, category } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    let query = Product.find(filter);

    if (sort === 'price-asc') query = query.sort({ price: 1 });
    else if (sort === 'price-desc') query = query.sort({ price: -1 });

    const products = await query;
    res.json(products);

  } catch (error) {
    console.error("Error fetching products:", error.message);
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// ==========================
// GET PRODUCT BY ID (Public)
// ==========================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
};

// ==========================
// CREATE PRODUCT (Admin only)
// ==========================
const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, oldPrice, onSale, image, stock, category,
      ratings, materials, colors, carats, deliveryInfo
    } = req.body;

    // Check required fields
    if (!name || !description || !price || !image || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Convert numbers safely
    const priceNum = Number(price);
    const oldPriceNum = oldPrice ? Number(oldPrice) : undefined;
    const stockNum = stock ? Number(stock) : 0;

    // On sale only if oldPrice > price
    const finalOnSale = onSale && oldPriceNum && oldPriceNum > priceNum;

    // Images handling
    const imagesArray = typeof image === 'string' ? image.split(',').map(img => img.trim()) : [];

    const newProduct = new Product({
      name,
      description,
      price: priceNum,
      oldPrice: oldPriceNum,
      onSale: finalOnSale,
      image: imagesArray[0] || '',
      images: imagesArray,
      materials: materials || [],
      colors: colors || [],
      carats: carats || [],
      deliveryInfo: deliveryInfo || {},
      stock: stockNum,
      category,
      ratings: ratings || 0,
      isOutOfStock: stockNum === 0
    });

    await newProduct.save();
    res.status(201).json(newProduct);

  } catch (error) {
    console.error('Error creating product:', error.message);
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
};

// ==========================
// UPDATE PRODUCT (Admin only)
// ==========================
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const {
      name, description, price, oldPrice, onSale, stock,
      materials, colors, carats, deliveryInfo
    } = req.body;

    // Safe number conversion
    const priceNum = price ? Number(price) : product.price;
    const oldPriceNum = oldPrice ? Number(oldPrice) : product.oldPrice;
    const stockNum = stock ? Number(stock) : product.stock;

    // On sale logic
    const finalOnSale = onSale && oldPriceNum && oldPriceNum > priceNum;

    // Update fields
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = priceNum;
    product.oldPrice = oldPriceNum;
    product.onSale = finalOnSale;
    product.stock = stockNum;
    product.isOutOfStock = stockNum === 0;
    product.materials = materials ?? product.materials;
    product.colors = colors ?? product.colors;
    product.carats = carats ?? product.carats;
    product.deliveryInfo = deliveryInfo ?? product.deliveryInfo;

    await product.save();
    res.json(product);

  } catch (error) {
    console.error('Failed to update product:', error.message);
    res.status(500).json({ message: 'Failed to update product', error: error.message });
  }
};

// ==========================
// DELETE PRODUCT (Admin only)
// ==========================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Failed to delete product:', error.message);
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};