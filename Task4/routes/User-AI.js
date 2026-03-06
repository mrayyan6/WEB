// ═══════════════════════════════════════════════════════════════════════════════
//  User-AI.js — User class with Mongoose model and bcrypt password hashing
// ═══════════════════════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Mongoose Schema & Model ────────────────────────────────────────────────
// Define the shape of every document in the "users" collection.
// `unique: true` on username prevents duplicate registrations at the DB level.
// `required: true` ensures neither field can be left empty.
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,       // enforces a unique index in MongoDB
        trim: true           // strips leading/trailing whitespace
    },
    password: {
        type: String,
        required: true
    }
});

const UserModel = mongoose.model('User', userSchema);

// ─── User Class ─────────────────────────────────────────────────────────────
// Encapsulates all authentication logic (register & login).
// Each instance holds a plain-text username + password received from the client;
// hashing happens internally before anything touches the database.
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    // ── Register ────────────────────────────────────────────────────────────
    // 1. Hashes the plain-text password with a salt round of 10.
    // 2. Creates and saves a new document in the users collection.
    // 3. Returns { success: true } on success.
    // 4. If the username already exists (duplicate key error code 11000),
    //    returns a friendly error instead of crashing.
    async register() {
        try {
            // Generate a salt and hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(this.password, salt);

            // Build and persist the new user document
            const newUser = new UserModel({
                username: this.username,
                password: hashedPassword       // never store plain text!
            });
            await newUser.save();

            return { success: true };

        } catch (error) {
            // Mongo duplicate-key error → username already taken
            if (error.code === 11000) {
                return { success: false, message: 'Username already exists' };
            }
            // Unexpected error → bubble it up so the route can respond with 500
            throw error;
        }
    }

    // ── Login ───────────────────────────────────────────────────────────────
    // 1. Looks up the user by username.
    // 2. Uses bcrypt.compare() to verify the hashed password.
    // 3. Returns the user document on success, or null on failure.
    async login() {
        try {
            // Find the user in the database by username
            const user = await UserModel.findOne({ username: this.username });

            // If no user found, credentials are invalid
            if (!user) return null;

            // Compare the plain-text password against the stored hash
            const isMatch = await bcrypt.compare(this.password, user.password);

            // Return the user document only if the password matches
            return isMatch ? user : null;

        } catch (error) {
            // Unexpected error → bubble it up
            throw error;
        }
    }
}

module.exports = User;
