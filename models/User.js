const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  isAdmin: { type: Boolean, default: false }, 
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] 
}, { timestamps: true } );

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create a method to add a product to the wishlist
userSchema.methods.addToWishlist = async function (productId) {
  // Check if product is already in wishlist
  if (!this.wishlist.includes(productId)) {
    this.wishlist.push(productId);
    await this.save();
    return this.wishlist;
  }
  throw new Error('Product is already in wishlist');
};

// Create a method to remove a product from the wishlist
userSchema.methods.removeFromWishlist = async function (productId) {
  this.wishlist = this.wishlist.filter(item => item.toString() !== productId.toString());
  await this.save();
  return this.wishlist;
};

module.exports = mongoose.model('User', userSchema);
