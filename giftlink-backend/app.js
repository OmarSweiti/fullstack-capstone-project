/*jshint esversion: 8 */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');

const { connectToDatabase, closeConnection } = require('./models/db.new');
const {loadData} = require("./util/import-mongo/index");

const app = express();
app.use("*", cors());
const port = 3060;

// Connect to MongoDB; we just do this one time
connectToDatabase()
    .then(() => {
        pinoLogger.info('Connected to DB');
        // Start the server only after successful database connection
        startServer();
    })
    .catch((e) => {
        console.error('Failed to connect to DB', e);
        process.exit(1); // Exit with error code
    });

/**
 * Start the Express server
 */
function startServer() {
    app.use(express.json());

    // Route files
    const giftRoutes = require('./routes/giftRoutes');
    const authRoutes = require('./routes/authRoutes');
    const searchRoutes = require('./routes/searchRoutes.js');
    const pinoHttp = require('pino-http');
    const logger = require('./logger');

    app.use(pinoHttp({ logger }));

    // Use Routes
    app.use('/api/gifts', giftRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/search', searchRoutes);

    // Global Error Handler
    app.use((err, req, res, next) => {
        console.error(err);
        pinoLogger.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    app.get("/", (req, res) => {
        res.send("Inside the server");
    });

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await closeConnection();
    process.exit(0);
});