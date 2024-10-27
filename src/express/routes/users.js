const express = require('express');
const router = express.Router();
const userController = require('../../db/functions/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../db/models/user'); 
const { jwtSecret, jwtExpiration } = require('../../../../Xui/config'); 
const {CartItem} = require('../../db/models/cart');
const Item = require('../../db/models/item');
const Order = require('../../db/models/order');

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid Email or password' });
        }

        // Checking password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid Email or password' });
        }

        // Generation of JWT
        const token = jwt.sign({ id: user._id, username: user.email}, jwtSecret, {
            expiresIn: jwtExpiration,
        });

        res.json({ token }); // token
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// User Registration
router.post('/register', async (req, res) => {
    const { name, surname, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, surname, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error registering user' });
    }
});

//Items List for User
router.post('/useritems', async (req, res) => {
    try {
        const { name, size, amount } = req.body;

        const bearer = req.headers['authorization'];
        if (!bearer) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = bearer.split(' ')[1];
        const decodedToken = await jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const item = await Item.findOne({ name }, '_id');
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const itemId = item._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        const userCart = user.cart;
        let hasCartBeenFound = false;
        for(let element of userCart) {
            if (!element) continue
            let cartItem = await CartItem.findOne({_id : element});
            if (!cartItem) continue

            if (cartItem.item.toString() === itemId.toString() && cartItem.size === size){
                const newAmount = parseInt(cartItem.amount)+ parseInt(amount);
                const updatedItem = await CartItem.findByIdAndUpdate(cartItem._id, {amount: newAmount} );
                hasCartBeenFound = true;
                break;
            }
        }

        if (!hasCartBeenFound) {
            const newCartItem = new CartItem({ item: itemId, amount, size });
            await newCartItem.save();
            user.cart.push(newCartItem._id);
            await user.save();
        }

        res.status(200).json({ message: 'Item added to cart successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching items' });
        console.log(error);
    }
})




// Cart
router.get('/cart', async (req, res) => {
    try {
        const bearer = req.headers['authorization'];
        if (!bearer) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = bearer.split(' ')[1];
        const decodedToken = await jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const cart = user.cart;

        let cartList = [];

        for (let element of cart){
            if (!element) continue
            const dbCartItem = await CartItem.findById(element);
            if (!dbCartItem) continue
            const dbItem = await Item.findById(dbCartItem.item);
            const {size, amount} = dbCartItem;
            
            const name = dbItem.name;

            cartList.push({name, amount, size});
        }
        res.json(cartList);

    } catch (error) {
        res.status(500).json({ error: 'Error fetching items' });
        console.log(error);
    }
});

// Deleting Item from Cart
router.delete('/cartDelete',  async (req, res) => {
    try {

        const sizeToDelete = req.query.size
        const nameToDelete = req.query.name

        const bearer = req.headers['authorization'];
        if (!bearer) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = bearer.split(' ')[1];
        const decodedToken = await jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const item = await Item.findOne({ name : nameToDelete }, '_id');

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }
        const itemId = item._id;
        
        const userCart = user.cart;
        let hasCartBeenFound = false;
        for(let element of userCart) {
            if (!element) continue
            let cartItem = await CartItem.findOne({_id : element});
            if (!cartItem) continue

            if (cartItem.item.toString() === itemId.toString() && cartItem.size === sizeToDelete){
                deletedCartItem = await CartItem.findByIdAndDelete(cartItem._id);
                hasCartBeenFound = true
            }
        }

        if (!hasCartBeenFound) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json({ message: 'Item deleted successfully', item: deletedCartItem });
        

    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// All User's Orders
router.get('/:userId/orders',  async (req, res) => {
    try {
        const orders = await orderController.getOrdersByUserId(req.params.userId); 
        res.json(orders); 
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});
//Meow
router.get('/placeOrder', async (req, res) => {
    try {

        const bearer = req.headers['authorization'];
        if (!bearer) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = bearer.split(' ')[1];
        const decodedToken = await jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const itemsOrderArray = await Promise.all(
            user.cart.map(async (id) => {
                const cartitem = await CartItem.findById(id); // toString
                return cartitem;
            })
        );

        
        const newOrder = await new Order({items : itemsOrderArray});
        newOrder.save();

        user.cart = [];
        user.orders.push(newOrder._id);
        user.save();


        res.json({message: 'Meow'});
    } catch (error) {
        res.status(500).json({ error: 'Error placing order' });
        console.log(error);
    }
})

// Order Info
router.get('/orders',  async (req, res) => {
    try {
        const bearer = req.headers['authorization'];
        if (!bearer) {
            return res.status(401).json({ error: 'Authorization header missing' });
        }
        const token = bearer.split(' ')[1];
        const decodedToken = await jwt.verify(token, jwtSecret);
        const userId = decodedToken.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        let orders = [];
        for (let element of user.orders){
            if (!element) continue
            const order = await Order.findById(element);
            if (!order) continue
            orders.push(order);
        }
        console.log(orders);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
        console.log(error);
    }
});

module.exports = router;