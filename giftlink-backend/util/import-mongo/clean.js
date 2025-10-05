/* jshint esversion: 8 */
require('dotenv').config();
const { connectToDatabase, closeConnection } = require('../../models/db.new');

async function cleanDatabase() {
    try {
        const db = await connectToDatabase();
        
        console.log('Dropping collections...');
        
        const collections = await db.listCollections().toArray();
        
        for (const collection of collections) {
            if (collection.name === 'gifts' || collection.name === 'users') {
                await db.collection(collection.name).drop();
                console.log(`Dropped collection: ${collection.name}`);
            }
        }
        
        console.log('Database cleaned successfully.');
    } catch (e) {
        console.error('Error cleaning database:', e);
    } finally {
        await closeConnection();
    }
}

cleanDatabase();
