const express = require('express');
const cors = require('cors');
const path = require('path');

const userRouter = require('./routes/users');
const itemRouter = require('./routes/items');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRouter);
app.use('/api/items', itemRouter);

app.use(express.static(path.join(__dirname, '../views')));

// Define routes for HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/items', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'itemsMenu.html'));
});

app.get('/items/add', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'addItem.html'));
});

app.get('/items/edit', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'editItem.html'));
});

app.get('/items/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'itemsList.html'));
});

app.get('/items/delete', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'deleteItem.html'));
});

app.get('/userMenu', (req, res) =>{
    res.sendFile(path.join(__dirname, 'views', 'usersMenu.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'register.html'));
});

app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'userAccount.html'));
});

app.get('/cart', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'cart.html'));
});

app.get('/orders', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'orders.html'));
});

app.get('/order/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'orderDetail.html'));
});

app.get('/items/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'itemDetail.html'));
});

app.get('/useritems', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'userItems.html'));
});

// Middleware для проверки токена
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Получаем токен из заголовка
    console.log('Authorization Header:', req.headers['authorization']); // Log the header for debugging
    if (!token) {
        return res.status(403).json({ error: 'Token is required for authentication' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            console.error('Token verification failed:', err);
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.userId = decoded.id; // Сохраняем id пользователя
        next();
    });
};

// Export the app
module.exports = app;
