// ═══════════════════════════════════════════════════════════════════════════════
//  server-AI.js — Production-ready Express authentication server
// ═══════════════════════════════════════════════════════════════════════════════

// ─── Load Environment Variables ─────────────────────────────────────────────
// dotenv reads the .env file and injects its values into process.env.
// Must be called BEFORE any code that references process.env.
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const User = require('./routes/User-AI');

const app = express();

// ─── Body-Parsing Middleware ────────────────────────────────────────────────
// Allows the server to read JSON and URL-encoded bodies from POST requests.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Session Configuration ──────────────────────────────────────────────────
// The session secret is pulled from .env so it's never hard-coded in source.
// httpOnly   → prevents client-side JS from reading the cookie (XSS defence).
// sameSite   → 'strict' blocks cross-site request forgery (CSRF defence).
// secure     → set to true in production so cookies travel only over HTTPS.
// maxAge     → auto-expire the session after 1 hour of inactivity.
app.use(session({
    secret: 'superSecretKey_changeMeInProduction',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,             // cookie inaccessible to document.cookie
        sameSite: 'strict',         // cookie sent only for same-site requests
        secure: false,              // set to true behind HTTPS in production
        maxAge: 1000 * 60 * 60      // 1 hour in milliseconds
    }
}));

// ─── MongoDB Connection ─────────────────────────────────────────────────────
// Gracefully handle connection errors and log success/failure to the console.
mongoose.connect('mongodb://localhost:27017/studentDB')
    .then(() => console.log('✅  Connected to MongoDB — studentDB'))
    .catch((err) => {
        console.error('❌  MongoDB connection error:', err.message);
        process.exit(1);    // stop the server if the DB is unreachable
    });

// ─── Authentication Middleware ──────────────────────────────────────────────
// Reusable guard: if the user has an active session, proceed;
// otherwise, respond with 401 Unauthorized.
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    return res.status(401).send('Please login first');
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

// ── POST /register ──────────────────────────────────────────────────────────
// Creates a new user with a hashed password.
// Responds with 201 on success, 409 on duplicate, 500 on server error.
app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic input validation
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const user = new User(username, password);
        const result = await user.register();

        if (result.success) {
            return res.status(201).send('User registered successfully');
        }

        // Duplicate username
        return res.status(409).send(result.message);

    } catch (error) {
        console.error('Register error:', error.message);
        return res.status(500).send('Internal server error');
    }
});

// ── POST /login ─────────────────────────────────────────────────────────────
// Validates credentials and starts a session on success.
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic input validation
        if (!username || !password) {
            return res.status(400).send('Username and password are required');
        }

        const user = new User(username, password);
        const found = await user.login();

        if (found) {
            // Store only the username in the session (avoid leaking the hash)
            req.session.user = found.username;
            return res.send('Login successful');
        }

        return res.status(401).send('Invalid credentials');

    } catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).send('Internal server error');
    }
});

// ── GET /dashboard ──────────────────────────────────────────────────────────
// Protected route — only accessible to authenticated users.
app.get('/dashboard', isAuthenticated, (req, res) => {
    return res.send('Welcome ' + req.session.user);
});

// ── GET /logout ─────────────────────────────────────────────────────────────
// Destroys the server-side session and clears the cookie from the browser.
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err.message);
            return res.status(500).send('Could not log out');
        }

        // Clear the session cookie from the client
        res.clearCookie('connect.sid');
        return res.send('Logout successful');
    });
});

// ─── Start the Server ───────────────────────────────────────────────────────
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
});
