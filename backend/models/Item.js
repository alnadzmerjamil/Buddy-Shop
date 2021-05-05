const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ItemSchema = new Schema({
  name: String,
  mainCategory: String,
  subCategory: String,
  quantity: Number,
  price: String,
  image: [String],
});
module.exports = mongoose.model('Item', ItemSchema);
