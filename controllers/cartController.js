const Cart = require("../models/Cart");

// ADD / UPDATE CART
exports.addToCart = async (req, res) => {
  try {
    const { guestId } = req.params;
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ guestId });

    if (!cart) {
      cart = new Cart({ guestId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();

    // ✅ ALWAYS populate before sending
    const updatedCart = await Cart.findOne({ guestId })
      .populate("items.product");

    res.json(updatedCart);

  } catch (err) {
    console.error("AddToCart Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET CART
exports.getCart = async (req, res) => {
  try {
    const { guestId } = req.params;

    const cart = await Cart.findOne({ guestId })
      .populate("items.product");

    if (!cart) {
      return res.json({ items: [] });
    }

    res.json(cart);

  } catch (err) {
    console.error("GetCart Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {
    const { guestId, productId } = req.params;

    const cart = await Cart.findOne({ guestId });

    if (!cart) return res.json({ items: [] });

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    // ✅ populate before response
    const updatedCart = await Cart.findOne({ guestId })
      .populate("items.product");

    res.json(updatedCart);

  } catch (err) {
    console.error("Remove Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* =========================
   CLEAR CART
========================= */
exports.clearCart = async (req, res) => {
  try {

    const { guestId } = req.params;

    await Cart.findOneAndDelete({ guestId });

    res.json({ message: "Cart cleared" });

  } catch (err) {
    console.error("ClearCart Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
