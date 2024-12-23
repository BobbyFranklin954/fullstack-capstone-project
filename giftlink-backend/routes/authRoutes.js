//Step 1 - Task 2: Import necessary packages
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken'); // For JWT functionality
const pino = require('pino'); // For logging
const bcryptjs = require('bcryptjs'); // For password hashing (will be used later)
const { body, validationResult } = require('express-validator');
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
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            authToken,
        });
    } catch (error) {
        logger.error('Error registering user:', error.message);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Step 1: Validate input
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Step 2: Connect to MongoDB
        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Fetch user details from the database
        const user = await collection.findOne({ email });

        // Check if user exists
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Step 3: Compare passwords
        const isPasswordValid = await bcryptjs.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        // Step 4: Generate JWT
        const authToken = jwt.sign(
            { userId: user._id, email: user.email },
            jwtSecret,
            { expiresIn: '1h' } // Token expires in 1 hour
        );

        // Step 5: Respond to client
        logger.info(`User logged in successfully: ${user.email}`);
        res.status(200).json({
            message: 'Login successful',
            email: user.email,
            firstName: user.firstName,
            lastName: newUser.lastName,
            authToken,
        });
    } catch (error) {
        logger.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.put('/update', [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const emailFromHeader = req.header('email');
        if (!emailFromHeader) {
            return res.status(400).json({ message: 'Email is required in the headers' });
        }

        const db = await connectToDatabase();
        const collection = db.collection('users');

        // Check if user exists
        const user = await collection.findOne({ email: emailFromHeader });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update the user details
        await collection.updateOne(
            { email: emailFromHeader },
            { $set: { firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email } }
        );

        const authToken = jwt.sign(
            { userId: user._id, email: user.email },
            jwtSecret,
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'User updated successfully',
            email: user.email,
            firstName: req.body.firstName,
            authToken
        });
    } catch (error) {
        logger.error('Error updating user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;