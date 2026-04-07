const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/studentDB';

let connectionPromise = null;

async function connectToDatabase()
{
    if (mongoose.connection.readyState === 1)
    {
        return mongoose.connection;
    }

    if (!connectionPromise)
    {
        connectionPromise = mongoose.connect(MONGODB_URI)
            .then((connection) =>
            {
                console.log(`Connected to MongoDB: ${connection.connection.name}`);
                return connection;
            })
            .catch((error) =>
            {
                connectionPromise = null;
                console.error('MongoDB connection error:', error.message);
                throw error;
            });
    }

    return connectionPromise;
}

module.exports = {
    connectToDatabase
};