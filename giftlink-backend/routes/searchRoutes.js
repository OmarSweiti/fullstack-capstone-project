/* jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db.new');

/**
 * Search for gifts with various filters
 */
router.get('/', async (req, res, next) => {
    try {
        // Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Add the name filter to the query if the name parameter is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category;
        }
        if (req.query.condition) {
            query.condition = req.query.condition;
        }
        if (req.query.age_years) {
            query.age_years = { $lte: parseInt(req.query.age_years) };
        }
        if (req.query.price) {
            // Price can be a range (min-max) or a single value
            if (req.query.price.includes('-')) {
                const [min, max] = req.query.price.split('-').map(Number);
                query.price = { $gte: min, $lte: max };
            } else {
                query.price = { $lte: parseInt(req.query.price) };
            }
        }

        // Fetch filtered gifts
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        console.error('Error searching gifts:', e);
        res.status(500).json({ error: 'Error searching gifts', details: e.message });
    }
});

/**
 * Get all unique categories
 */
router.get('/categories', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");

        // Get unique categories
        const categories = await collection.distinct("category");

        res.json(categories);
    } catch (e) {
        console.error('Error fetching categories:', e);
        res.status(500).json({ error: 'Error fetching categories', details: e.message });
    }
});

module.exports = router;