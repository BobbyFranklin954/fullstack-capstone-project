const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb'); // Import ObjectId
const connectToDatabase = require('../models/db');

router.get('/', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gifts = await collection.find({}).toArray();
        res.json(gifts);
    } catch (e) {
        console.error('Error fetching gifts:', e);
        res.status(500).send('Error fetching gifts');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');

        const id = req.params.id;

        // Validate the ID format
        if (!ObjectId.isValid(id)) {
            return res.status(400).send('Invalid ID format');
        }

        // Find the gift by ID
        const gift = await collection.findOne({ _id: new ObjectId(id) });

        if (!gift) {
            return res.status(404).send('Gift not found');
        }

        res.json(gift);
    } catch (e) {
        console.error('Error fetching gift:', e);
        res.status(500).send('Error fetching gift');
    }
});

// Add a new gift
router.post('/', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('gifts');
        const gift = await collection.insertOne(req.body);
        res.status(201).json(gift.ops[0]);
    } catch (e) {
        next(e);
    }
});

module.exports = router;