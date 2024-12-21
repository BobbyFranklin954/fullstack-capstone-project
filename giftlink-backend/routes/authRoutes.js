//Step 1 - Task 2: Import necessary packages
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // For JWT functionality
const pino = require('pino'); // For logging
const bcryptjs = require('bcryptjs'); // For password hashing (will be used later)
const connectToDatabase = require('../models/db');

//Step 1 - Task 3: Create a Pino logger instance
const logger = pino({
    level: process.env.LOG_LEVEL || 'info', // Set the log level (default to 'info')
    transport: {
        target: 'pino-pretty', // Makes logs more readable during development
        options: {
            colorize: true, // Enable colorized logs
        },
    },
});
dotenv.config();

//Step 1 - Task 4: Create JWT secret
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
    logger.error('JWT secret is not defined in the environment variables.');
    throw new Error('JWT secret is required');
}

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validate the input
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if the email already exists
        const db = await connectToDatabase();
        const collection = db.collection('users');
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Hash the password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Save the user to the database
        const newUser = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            createdAt: new Date(),
        };
        const result = await collection.insertOne(newUser);

        // Generate JWT
        const authToken = jwt.sign(
            { userId: result.insertedId, email: newUser.email },
            jwtSecret,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        logger.info(`User registered successfully: ${newUser.email}`);

        // Respond to the client
        return res.status(201).json({
            message: 'User registered successfully',
            email: newUser.email,
            authToken,
        });
    } catch (error) {
        logger.error('Error registering user:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});
module.exports = router;