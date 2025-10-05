/* jshint esversion: 8 */
// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

// MongoDB connection URL with authentication options
const url = process.env.MONGO_URL ? `${process.env.MONGO_URL}/${process.env.DB_NAME || 'giftdb'}?retryWrites=true&w=majority` : 'mongodb://localhost:27017/giftdb';
const dbName = process.env.DB_NAME || 'giftdb';

let dbInstance = null;
let clientInstance = null;

// Connection options
const options = {
    maxPoolSize: 10, // Maximum number of connections in the pool
    serverSelectionTimeoutMS: 5000, // Timeout for selecting a server
    socketTimeoutMS: 45000, // Timeout for socket operations
    connectTimeoutMS: 10000, // Initial connection timeout
    retryWrites: true,
    w: 'majority'
};

/**
 * Connect to MongoDB with retry mechanism
 * @returns {Promise<Db>} MongoDB database instance
 */
async function connectToDatabase() {
    // If we already have a database instance, return it
    if (dbInstance) {
        return dbInstance;
    }

    try {
        // If we don't have a client, create one
        if (!clientInstance) {
            clientInstance = new MongoClient(url, options);

            // Connect with retry mechanism
            let retries = 5;
            while (retries > 0) {
                try {
                    await clientInstance.connect();
                    console.log("Successfully connected to MongoDB");
                    break;
                } catch (err) {
                    retries -= 1;
                    if (retries === 0) {
                        console.error("Failed to connect to MongoDB after retries:", err);
                        throw err;
                    }
                    console.log(`Connection failed, retrying in 5 seconds... (${retries} attempts left)`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }

        // Get the database instance
        dbInstance = clientInstance.db(dbName);
        return dbInstance;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
}

/**
 * Close the MongoDB connection
 */
async function closeConnection() {
    if (clientInstance) {
        await clientInstance.close();
        dbInstance = null;
        clientInstance = null;
        console.log("MongoDB connection closed");
    }
}

// Handle application termination
process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeConnection();
    process.exit(0);
});

module.exports = { connectToDatabase, closeConnection };