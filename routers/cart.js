const express = require('express');
const { getCart, addToCart, removeFromCart,clearCart } = require('../controllers/cartController');

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.delete('/:userId/:productId', removeFromCart);
router.delete('/:userId', clearCart); 
module.exports = router;
