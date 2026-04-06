const Cart = require('../models/Cart');
const Product = require('../models/Product'); // ✅ ADD THIS LINE

// 🛒 Get the user's cart
const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId })
      .populate('products.product');

    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart', error });
  }
};

// ➕ Add a product to the cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // ✅ FETCH PRODUCT FOR STOCK CHECK
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      cart = new Cart({ user: req.params.userId, products: [] });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    // ✅ CURRENT CART QUANTITY
    const existingQty =
      itemIndex > -1 ? cart.products[itemIndex].quantity : 0;

    // ✅ STOCK VALIDATION (THIS IS THE FIX)
    if (existingQty + quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    // ⬇️ YOUR ORIGINAL LOGIC (UNCHANGED)
    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    const updatedCart = await cart.save();
    const populatedCart = await updatedCart.populate('products.product');

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart', error });
  }
};

// ❌ Remove a product from the cart
const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== req.params.productId
    );

    const updatedCart = await cart.save();
    const populatedCart = await updatedCart.populate('products.product');

    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart', error });
  }
};

// 🧹 Clear the entire cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart', error });
  }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };
