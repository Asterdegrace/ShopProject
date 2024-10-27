const User = require('../models/user');
const bcrypt = require('bcrypt');

//These functions are not used because of changed architecture

// Get all Users
exports.getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Could not fetch users');
    }
};

// Get user by Id
exports.getUserById = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    } catch (error) {
        console.error(`Error fetching user with id ${id}:`, error);
        throw new Error('Could not fetch user');
    }
};

/*
exports.createUser = async (userData) => {
    try {
        // HAshing
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        userData.password = hashedPassword;

        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Could not create user');
    }
};*/

// Update User
exports.updateUser = async (id, userData) => {
    try {
        
        if (userData.password) {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            userData.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
        if (!updatedUser) {
            throw new Error('User not found');
        }
        return updatedUser;
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw new Error('Could not update user');
    }
};

// Delete User
exports.deleteUser = async (id) => {
    try {
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            throw new Error('User not found');
        }
        return deletedUser;
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw new Error('Could not delete user');
    }
};

// Add Item
exports.addItemToCart = async (userId, itemId, size, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user.addToCart(itemId, size, amount);
        return user;
    } catch (error) {
        console.error(`Error adding item to cart for user with id ${userId}:`, error);
        throw new Error('Could not add item to cart');
    }
};

// Delete Item from cart
exports.removeItemFromCart = async (userId, itemId, size, amount) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user.removeFromCart(itemId, size, amount);
        return user;
    } catch (error) {
        console.error(`Error removing item from cart for user with id ${userId}:`, error);
        throw new Error('Could not remove item from cart');
    }
};

// Create order
exports.createOrderForUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        await user.CreateOrder();
        return user;
    } catch (error) {
        console.error(`Error creating order for user with id ${userId}:`, error);
        throw new Error('Could not create order');
    }
};
