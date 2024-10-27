const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
    item : {type: mongoose.Schema.Types.ObjectId, ref: 'Item'},
    amount: {
        type: Number,
        min: 1,},
    size:  {
        type: String,
        enum: ['XS','S','M', 'L', 'XL'],
        required: true,},
});

const CartItem = mongoose.model('CartItem', cartItemSchema);

module.exports = {CartItem, cartItemSchema};