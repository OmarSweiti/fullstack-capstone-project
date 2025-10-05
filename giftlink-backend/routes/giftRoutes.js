/* jshint esversion: 8 */
const express = require('express');
const router = express.Router();
const { connectToDatabase } = require('../models/db.new');

/**
 * Get all gifts
 */
router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).json({ error: 'Error fetching gifts' });
    }
});

/**
 * Get a specific gift by ID
 */
router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params.id;
        
        const gift = await collection.findOne({ id: id });
        
        if (!gift) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).json({ error: 'Error fetching gift' });
    }
});

/**
 * Add a new gift
 */
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const gift = await collection.insertOne(req.body);

        res.status(201).json(gift.ops[0]);
    } catch (e) {
        next(e);
    }
});

/**
 * Update a gift by ID
 */
router.put('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params.id;
        
        const result = await collection.updateOne(
            { id: id },
            { $set: req.body }
        );
        
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        res.json({ message: 'Gift updated successfully' });
    } catch (e) {
        next(e);
    }
});

/**
 * Delete a gift by ID
 */
router.delete('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("gifts");
        const id = req.params.id;
        
        const result = await collection.deleteOne({ id: id });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Gift not found' });
        }

        res.json({ message: 'Gift deleted successfully' });
    } catch (e) {
        next(e);
    }
});

module.exports = router;