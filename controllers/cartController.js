const Cart = require('../models/Cart');
const Product = require('../models/Product');

/* =========================
   🛒 GET CART
========================= */
const getCart = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ guestId: userId })
      .populate('products.product');

    res.json({
      products: cart?.products || [],
    });

  } catch (error) {
    
    res.status(500).json({ message: 'Error fetching cart' });
  }
};

/* =========================
   ➕ ADD TO CART
========================= */
const addToCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ guestId: userId });

    if (!cart) {
      cart = new Cart({
        guestId: userId,
        products: [],
      });
    }

    const index = cart.products.findIndex(
      (p) => p.product.toString() === productId
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();

    const populated = await cart.populate('products.product');

    res.json({ products: populated.products });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding to cart' });
  }
};

/* =========================
   ❌ REMOVE ITEM
========================= */
const removeFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ guestId: userId });

    if (!cart) return res.json({ products: [] });

    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    await cart.save();

    const populated = await cart.populate('products.product');

    res.json({ products: populated.products });

  } catch (error) {
    res.status(500).json({ message: 'Error removing item' });
  }
};

/* =========================
   🧹 CLEAR CART
========================= */
const clearCart = async (req, res) => {
  try {
    const { userId } = req.params;

    await Cart.findOneAndDelete({ guestId: userId });

    res.json({ products: [] });

  } catch (error) {
    res.status(500).json({ message: 'Error clearing cart' });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
};
