const express = require('express');
const router = express.Router();
const connectToDatabase = require('../models/db');

// Search for gifts
router.get('/', async (req, res, next) => {
    try {
        // Task 1: Connect to MongoDB using connectToDatabase database. Remember to use the await keyword and store the connection in `db`
        const db = await connectToDatabase();

        const collection = db.collection("gifts");

        // Initialize the query object
        let query = {};

        // Task 2: Add the name filter to the query if the name parameter is not empty
        if (req.query.name && req.query.name.trim() !== '') {
            query.name = { $regex: req.query.name, $options: "i" }; // Using regex for partial match, case-insensitive
        }

        // Task 3: Add other filters to the query
        if (req.query.category) {
            query.category = req.query.category; // Exact match for category
        }
        if (req.query.condition) {
            query.condition = req.query.condition; // Exact match for condition
        }
        if (req.query.age_min && req.query.age_max) {
            query.age_years = {
                $gte: parseFloat(req.query.age_min),
                $lte: parseFloat(req.query.age_max),
            };
        }

        // Task 4: Fetch filtered gifts using the find(query) method. Make sure to use await and store the result in the `gifts` constant
        const gifts = await collection.find(query).toArray();

        res.json(gifts);
    } catch (e) {
        next(e);
    }
});

module.exports = router;
