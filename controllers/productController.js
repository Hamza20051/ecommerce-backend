const Product = require('../models/Product');

/* =========================
   📦 GET ALL PRODUCTS
========================= */
const getProducts = async (req, res) => {
  try {
    const { search, sort, category, page, limit } = req.query;

    let filter = {};

    if (category) filter.category = category;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } }
      ];
    }

    let query = Product.find(filter);

    if (sort === 'price-asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 0;

    if (limitNum > 0) {
      query = query.skip((pageNum - 1) * limitNum).limit(limitNum);
    }

    const products = await query;
    res.json(products);

  } catch (error) {
    console.error("Get Products Error:", error.message);
    res.status(500).json({ message: 'Error fetching products' });
  }
};


/* =========================
   🔍 GET PRODUCT BY ID
========================= */
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);

  } catch (error) {
    console.error("Get Product Error:", error.message);
    res.status(500).json({ message: 'Error fetching product' });
  }
};


/* =========================
   ➕ CREATE PRODUCT
========================= */
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      oldPrice,
      onSale,
      image,
      images, // ✅ FIXED: read images
      stock,
      category,
      ratings,
      materials,
      colors,
      carats,
      deliveryInfo,
    } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const priceNum = Number(price);
    const oldPriceNum = oldPrice ? Number(oldPrice) : 0;
    const stockNum = stock ? Number(stock) : 0;

    const finalOnSale = Boolean(onSale) && oldPriceNum > priceNum;

    // ✅ FIXED IMAGE HANDLING
    const imagesArray = Array.isArray(images) ? images : [];
    const mainImage =
      image ||
      (imagesArray.length > 0 ? imagesArray[0] : '');

    const newProduct = new Product({
      name,
      description,
      price: priceNum,
      oldPrice: oldPriceNum,
      onSale: finalOnSale,

      image: mainImage,   // ✅ FIXED
      images: imagesArray, // ✅ FIXED

      materials: Array.isArray(materials) ? materials : [],
      colors: Array.isArray(colors) ? colors : [],
      carats: Array.isArray(carats) ? carats : [],
      deliveryInfo: deliveryInfo || {},
      stock: stockNum,
      category,
      ratings: Number(ratings) || 0,
      isOutOfStock: stockNum === 0,
    });

    await newProduct.save();

    res.status(201).json(newProduct);

  } catch (error) {
    console.error('Create Product Error:', error.message);
    res.status(500).json({ message: 'Error creating product' });
  }
};


/* =========================
   ✏️ UPDATE PRODUCT
========================= */
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const {
      name,
      description,
      price,
      oldPrice,
      onSale,
      stock,
      materials,
      colors,
      carats,
      deliveryInfo,
      images // ✅ FIXED
    } = req.body;

    const priceNum = price ? Number(price) : product.price;
    const oldPriceNum = oldPrice ? Number(oldPrice) : product.oldPrice;
    const stockNum = stock ? Number(stock) : product.stock;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = priceNum;
    product.oldPrice = oldPriceNum;

    product.onSale = Boolean(onSale) && oldPriceNum > priceNum;

    product.stock = stockNum;
    product.isOutOfStock = stockNum <= 0;

    product.materials = Array.isArray(materials)
      ? materials
      : product.materials;

    product.colors = Array.isArray(colors)
      ? colors
      : product.colors;

    product.carats = Array.isArray(carats)
      ? carats
      : product.carats;

    product.deliveryInfo = deliveryInfo ?? product.deliveryInfo;

    // ✅ FIXED IMAGE UPDATE
    if (Array.isArray(images)) {
      product.images = images;
      product.image = images[0] || product.image;
    }

    await product.save();

    res.json(product);

  } catch (error) {
    console.error('Update Product Error:', error.message);
    res.status(500).json({ message: 'Failed to update product' });
  }
};


/* =========================
   ❌ DELETE PRODUCT
========================= */
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });

  } catch (error) {
    console.error('Delete Product Error:', error.message);
    res.status(500).json({ message: 'Failed to delete product' });
  }
};


/* =========================
   EXPORTS
========================= */
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
