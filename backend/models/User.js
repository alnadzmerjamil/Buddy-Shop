const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  username: String,
  password: String,
  role: String,
  information: [
    {
      firstName: String,
      middleName: String,
      lastName: String,
      emailAddress: String,
      contactNumber: Number,
      address: String,
    },
  ],
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
  ],
});
module.exports = mongoose.model('User', UserSchema);
