// db.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });
const MongoClient = require('mongodb').MongoClient;

// MongoDB connection URL with authentication options
let url = `${process.env.MONGO_URL}`;

let dbInstance = null;
const dbName = "giftdb";

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance
    };

    try {
        const client = new MongoClient(url);

        // Task 1: Connect to MongoDB
        await client.connect();
        console.log('Connected to MongoDB successfully!');

        // Task 2: Connect to database giftdb and store in variable dbInstance
        dbInstance = client.db(dbName);

        // Task 3: Return database instance
        return dbInstance;
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err; // Rethrow error to be handled by the caller
    }
}

module.exports = connectToDatabase;
