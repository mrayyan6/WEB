const mongoose = require('mongoose');

// Mongoose Schema and Model
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

const UserModel = mongoose.model('User', userSchema);

// User Class
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }

    async register() {
        const newUser = new UserModel({
            username: this.username,
            password: this.password
        });
        await newUser.save();
    }

    async login() {
        const user = await UserModel.findOne({
            username: this.username,
            password: this.password
        });
        return user;
    }
}

module.exports = User;
