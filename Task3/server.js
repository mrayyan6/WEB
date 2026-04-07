const express = require('express');
const session = require('express-session');
const User = require('./routes/User');
const SyncRecord = require('./models/SyncRecord');
const { connectToDatabase } = require('./config/database');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: false
}));

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

app.post('/sync-login-data', isAuthenticated, async (req, res) => {
    try {
        const { identifier, clientData } = req.body;

        if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
            return res.status(400).json({ message: 'A valid identifier is required' });
        }

        const normalizedIdentifier = identifier.trim();
        const existingRecord = await SyncRecord.findOne({ identifier: normalizedIdentifier }).lean();

        if (existingRecord) {
            return res.status(200).json({
                message: 'Existing data found',
                synced: false,
                data: existingRecord
            });
        }

        const newRecord = new SyncRecord({
            identifier: normalizedIdentifier,
            clientData: clientData ?? {},
            syncedAt: new Date()
        });

        await newRecord.save();

        return res.status(201).json({
            message: 'New data created and synced',
            synced: true,
            data: newRecord
        });
    } catch (error) {
        if (error.code === 11000) {
            const identifier = req.body?.identifier?.trim();

            if (identifier) {
                const record = await SyncRecord.findOne({ identifier }).lean();

                if (record) {
                    return res.status(200).json({
                        message: 'Existing data found',
                        synced: false,
                        data: record
                    });
                }
            }
        }

        console.error('Sync error:', error.message);
        return res.status(500).json({ message: 'Internal server error' });
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
async function startServer() {
    try {
        await connectToDatabase();

        app.listen(3000, () => {
            console.log('Server running on port 3000');
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}

startServer();
