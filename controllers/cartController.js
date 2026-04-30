const Cart = require('../models/Cart');
const Product = require('../models/Product');

/* =========================
   🛒 GET CART (GUEST FRIENDLY)
========================= */
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate(
      'products.product'
    );

    if (!cart) {
      return res.status(200).json({ products: [] });
    }

    res.json(cart);

  } catch (error) {
    console.error('Get Cart Error:', error);
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

/* =========================
   ➕ ADD TO CART (GUEST FRIENDLY)
========================= */
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, products: [] });
    }

    const itemIndex = cart.products.findIndex(
      (item) => item.product.toString() === productId
    );

    const existingQty =
      itemIndex > -1 ? cart.products[itemIndex].quantity : 0;

    if (existingQty + quantity > product.stock) {
      return res.status(400).json({
        message: `Only ${product.stock} item(s) available in stock`,
      });
    }

    if (itemIndex > -1) {
      cart.products[itemIndex].quantity += quantity;
    } else {
      cart.products.push({
        product: productId,
        quantity: Math.max(1, quantity),
      });
    }

    const updatedCart = await cart.save();

    const populatedCart = await updatedCart.populate(
      'products.product'
    );

    res.json(populatedCart);

  } catch (error) {
    console.error('Add to Cart Error:', error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

/* =========================
   ❌ REMOVE ITEM
========================= */
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== productId
    );

    const updatedCart = await cart.save();

    const populatedCart = await updatedCart.populate(
      'products.product'
    );

    res.json(populatedCart);

  } catch (error) {
    console.error('Remove Cart Error:', error);
    res.status(500).json({ message: 'Error removing from cart' });
  }
};

/* =========================
   🧹 CLEAR CART
========================= */
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.products = [];
    await cart.save();

    res.json({ message: 'Cart cleared successfully' });

  } catch (error) {
    console.error('Clear Cart Error:', error);
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
