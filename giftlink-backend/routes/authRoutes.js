/* jshint esversion: 8 */
const express = require('express');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectToDatabase } = require('../models/db.new');
const router = express.Router();
const dotenv = require('dotenv');
const pino = require('pino');  // Import Pino logger

// Use the `body`,`validationResult` from `express-validator` for input validation
const { body, validationResult } = require('express-validator');

const logger = pino();  // Create a Pino logger instance
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
      // Input validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        logger.error('Validation errors in registration', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }
      
      // Connect to MongoDB
      const db = await connectToDatabase();
      const collection = db.collection("users");
      const existingEmail = await collection.findOne({ email: req.body.email });

        if (existingEmail) {
            logger.error('Email id already exists');
            return res.status(400).json({ error: 'Email id already exists' });
        }

        const salt = await bcryptjs.genSalt(10);
        const hash = await bcryptjs.hash(req.body.password, salt);
        
        const newUser = await collection.insertOne({
            email: req.body.email,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            password: hash,
            createdAt: new Date(),
        });

        const payload = {
            user: {
                id: newUser.insertedId,
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User registered successfully');
        res.json({ authtoken, email: req.body.email });
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

/**
 * User login
 */
router.post('/login', async (req, res) => {
    try {
        // Input validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error('Validation errors in login', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }
        
        const db = await connectToDatabase();
        const collection = db.collection("users");
        const theUser = await collection.findOne({ email: req.body.email });

        if (theUser) {
            const result = await bcryptjs.compare(req.body.password, theUser.password);
            if(!result) {
                logger.error('Passwords do not match');
                return res.status(401).json({ error: 'Wrong password' });
            }
            
            const payload = {
                user: {
                    id: theUser._id.toString(),
                },
            };

            const userName = theUser.firstName;
            const userEmail = theUser.email;

            const authtoken = jwt.sign(payload, JWT_SECRET);
            logger.info('User logged in successfully');
            return res.status(200).json({ authtoken, userName, userEmail });
        } else {
            logger.error('User not found');
            return res.status(404).json({ error: 'User not found' });
        }
    } catch (e) {
        logger.error(e);
        return res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

/**
 * Update user information
 */
router.put('/update', [
    // Validation rules
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('name').notEmpty().withMessage('Name is required'),
], async (req, res) => {
    // Validate the input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Validation errors in update request', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const email = req.body.email;

        // Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection("users");

        // Find user credentials
        const existingUser = await collection.findOne({ email });

        if (!existingUser) {
            logger.error('User not found');
            return res.status(404).json({ error: "User not found" });
        }

        // Prepare update data
        const updateData = {
            firstName: req.body.name,
            lastName: req.body.lastName || existingUser.lastName,
            updatedAt: new Date()
        };

        // Update user credentials in DB
        const updatedUser = await collection.findOneAndUpdate(
            { email },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        // Create JWT authentication with user._id as payload using secret key from .env file
        const payload = {
            user: {
                id: updatedUser._id.toString(),
            },
        };

        const authtoken = jwt.sign(payload, JWT_SECRET);
        logger.info('User updated successfully');

        res.json({ authtoken });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

module.exports = router;