const mongoose = require('mongoose');
const Orders = require('./order');
const Cart = require('./cart');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z]+$/, 'Name should contain only alphabetic characters']
    },
    surname: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[a-zA-Z]+$/, 'Surname should contain only alphabetic characters']
    },
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        match: [/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, 'Surname should contain only alphabetic characters']
    },
    password: String,
    cart:[{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItem' }],
    orders:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
});

/*userSchema.methods.addToCart = async function (itemId, size, quantity){
    const item = await mongoose.model('Item').findById(itemId);
    if (!item) {
        throw new Error('Item not found');
    };

    const cartItemIndex = this.cart.findIndex(CartItem => {
        return CartItem.item.toString() === itemId.toString() && CartItem.size === size;
    });

    if (cartItemIndex >=0 ){
        this.cart[cartItemIndex].amount += quantity;
    } else {
        const newCartItemData = {
            item: itemId,
            size: size,
            amount: quantity,
        };
    const newCartItem = await new mongoose.model('CartItem')(newCartItemData).save();
    this.cart.push(newCartItem._id);

    };

    await this.save();

};

userSchema.methods.removeFromCart = async function (itemId, size, quantity){
    const cartItemIndex = this.cart.findIndex(CartItem => {
        return CartItem.item.toString() === itemId.toString() && CartItem.size === size;
    });

    if (cartItemIndex <0 ){
        throw new Error('Item not found');
    } else if (quantity >= this.cart[cartItemIndex].amount){
        this.cart.splice(cartItemIndex, 1);
    } else {
        this.cart.items[cartItemIndex].amount -= quantity;
    };

    await this.save();

};

userSchema.methods.CreateOrder = async function(){
    if (this.cart.length === 0){
       throw new Error('Cart is empty');
    };

    for (const element of this.cart) {
        const item = await mongoose.model('Item').findById(element.item);
        if (item.size === element.size) {
            if (item.amount < element.amount) {
                throw new Error('Not enough item');
            }
        }
    };    

    const newOrder = new mongoose.model('Order')({
        items: this.cart,
    });

    await newOrder.save();

    this.orders.push(newOrder._id);

    await this.save();
};*/

const User = mongoose.model('User', userSchema);

module.exports = User;