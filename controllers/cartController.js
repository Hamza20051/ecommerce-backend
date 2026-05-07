const Cart = require("../models/Cart");
const Product = require("../models/Product");

// ADD / UPDATE CART
exports.addToCart = async (req, res) => {
  try {

    const { guestId } = req.params;

    const productId = req.body.productId;

    const quantity = Number(req.body.quantity) || 1;

    // ✅ VALIDATION
    if (!productId) {
      return res.status(400).json({
        message: "Invalid product ID"
      });
    }

    // ✅ GET PRODUCT
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    // ✅ OUT OF STOCK
    if (product.stock <= 0) {
      return res.status(400).json({
        message: "Out of Stock"
      });
    }

    let cart = await Cart.findOne({ guestId });

    // ✅ CREATE CART IF NOT EXISTS
    if (!cart) {

      cart = new Cart({
        guestId,
        items: [],
      });

    }

    // ✅ FIND EXISTING ITEM
    const existingItem = cart.items.find(
      (item) =>
        item.product &&
        item.product.toString() === productId
    );

    // ✅ STOCK CHECK
    if (existingItem) {

      if (existingItem.quantity + quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`
        });
      }

      existingItem.quantity += quantity;

    } else {

      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} items available in stock`
        });
      }

      cart.items.push({
        product: productId,
        quantity,
      });

    }

    // ✅ SAVE CART
    await cart.save();

    res.json({
      success: true,
      message: "Added to cart",
    });

  } catch (err) {

    console.error("AddToCart Error:", err);

    res.status(500).json({
      message: "Server error",
    });

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

    res.status(500).json({
      message: "Server error",
    });

  }
};

// REMOVE ITEM
exports.removeFromCart = async (req, res) => {
  try {

    const { guestId, productId } = req.params;

    const cart = await Cart.findOne({ guestId });

    if (!cart) {
      return res.json({ items: [] });
    }

    // ✅ SAFE REMOVE
    cart.items = cart.items.filter(
      (item) =>
        item.product &&
        item.product.toString() !== productId
    );

    await cart.save();

    // ✅ UPDATED CART
    const updatedCart = await Cart.findOne({ guestId })
      .populate("items.product");

    res.json(updatedCart);

  } catch (err) {

    console.error("Remove Error:", err);

    res.status(500).json({
      message: "Server error",
    });

  }
};

/* =========================
   CLEAR CART
========================= */
exports.clearCart = async (req, res) => {
  try {

    const { guestId } = req.params;

    await Cart.findOneAndDelete({ guestId });

    res.json({
      message: "Cart cleared",
    });

  } catch (err) {

    console.error("ClearCart Error:", err);

    res.status(500).json({
      message: "Server error",
    });

  }
};
