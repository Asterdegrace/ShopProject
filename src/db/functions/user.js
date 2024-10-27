const User = require('../models/user');
const bcrypt = require('bcrypt');

// Получить всех пользователей
exports.getAllUsers = async () => {
    try {
        const users = await User.find();
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw new Error('Could not fetch users');
    }
};

// Получить пользователя по ID (или username)
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

/* Создать нового пользователя с хэшированным паролем
exports.createUser = async (userData) => {
    try {
        // Хэшируем пароль перед созданием пользователя
        const hashedPassword = await bcrypt.hash(userData.password, 10); // 10 - количество раундов шифрования
        userData.password = hashedPassword;

        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Could not create user');
    }
};*/

// Обновить пользователя с хэшированием пароля, если он изменяется
exports.updateUser = async (id, userData) => {
    try {
        // Проверяем, если передан пароль, хэшируем его
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

// Удалить пользователя
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

// Добавить айтем в корзину пользователя
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

// Удалить айтем из корзины пользователя
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

// Создать заказ для пользователя
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
