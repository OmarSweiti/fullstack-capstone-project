/* jshint esversion: 8 */
require('dotenv').config();
const { connectToDatabase, closeConnection } = require('../../models/db.new');
const fs = require('fs');

// MongoDB connection URL with authentication options
let filename = `${__dirname}/gifts.json`;
const collectionName = 'gifts';

// notice you have to load the array of gifts into the data object
const data = JSON.parse(fs.readFileSync(filename, 'utf8')).docs;

// connect to database and insert data into the collection
async function loadData() {
    let db;
    try {
        db = await connectToDatabase();
        console.log("Connected successfully to server");

        // collection will be created if it does not exist
        const collection = db.collection(collectionName);
        let cursor = await collection.find({});
        let documents = await cursor.toArray();

        if(documents.length == 0) {
            // Insert data into the collection
            const insertResult = await collection.insertMany(data);
            console.log('Inserted documents:', insertResult.insertedCount);
        } else {
            console.log("Gifts already exists in DB")
        }
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        if (db) {
            await closeConnection();
        }
    }
}

loadData();

module.exports = {
    loadData,
  };
