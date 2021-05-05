const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const OrderSchema = new Schema({
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      image: String,
      status: String,
    },
  ],
  status: String,
  courier: String,
  typeOfDelivery: String,
  modeOfPayment: String,
  shippingFee: Number,
  userFullName: String,
  userEmail: String,
  userContactNumber: Number,
  userAddress: String,
  message: String,
  date: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
module.exports = mongoose.model('Order', OrderSchema);
