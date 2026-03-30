const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./routes/User');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

// Auth middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.send('Please login first');
    }
}

// Routes
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User(username, password);
    await user.register();
    res.send('User registered successfully');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = new User(username, password);
    const found = await user.login();
    if (found) {
        req.session.user = username;
        res.send('Login successful');
    } else {
        res.send('Invalid credentials');
    }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send('Welcome ' + req.session.user);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logout successful');
});

// Start server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
