const mongoose = require('mongoose');
const {cartItemSchema} = require('./cart');

const orderSchema = new mongoose.Schema({
    items : [cartItemSchema], // Очень страшно
    orderDate: {type: Date, default: Date.now()},
});


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;