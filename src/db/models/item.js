const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {type: String, unique: true},
    colors: {
        type: [String],
        enum: ['Red', 'Green', 'Blue'],
        required: true,
    },
    sizes: {
        XS: {
            type: Number,
            min: 0,
            default: 0,},
        S: {
            type: Number,
            min: 0,
            default: 0,},
        M: {
            type: Number,
            min: 0,
            default: 0,},
        L: {
            type: Number,
            min: 0,
            default: 0},
        XL: {
            type: Number,
            min: 0,
            default: 0,},
    },
    cost: {
        type: Number,
        required: true,
        min: 1,
    }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;