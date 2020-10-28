const Mongoose = require('mongoose');

const { Schema } = Mongoose;
const UserProductViewSchema = new Schema({
  userId: String,
  viewDate: Date,
  productId : String 
});

module.exports = Mongoose.model('UserProductView', UserProductViewSchema);
