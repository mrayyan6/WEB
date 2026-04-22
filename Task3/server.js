const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./routes/User');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

mongoose.connect('mongodb://127.0.0.1:27017/studentDB')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));

function isAuthenticated(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

// GET routes — serve HTML forms
app.get('/register', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Register</title></head>
        <body>
            <h2>Register</h2>
            <form method="POST" action="/register">
                <label>Username: <input type="text" name="username" required /></label><br><br>
                <label>Password: <input type="password" name="password" required /></label><br><br>
                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </body>
        </html>
    `);
});

app.get('/login', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Login</title></head>
        <body>
            <h2>Login</h2>
            <form method="POST" action="/login">
                <label>Username: <input type="text" name="username" required /></label><br><br>
                <label>Password: <input type="password" name="password" required /></label><br><br>
                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
        </body>
        </html>
    `);
});

// POST routes — use User class
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User(username, password);
    await user.register();
    res.redirect('/login');
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = new User(username, password);
    const found = await user.login();
    if (found) {
        req.session.user = username;
        res.redirect('/dashboard');
    } else {
        res.send('Invalid credentials. <a href="/login">Try again</a>');
    }
});

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head><title>Dashboard</title></head>
        <body>
            <h2>Welcome, ${req.session.user}!</h2>
            <a href="/logout">Logout</a>
        </body>
        </html>
    `);
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
