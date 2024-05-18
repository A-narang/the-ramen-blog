
import express from 'express';
import debugModule from 'debug';
const debug = debugModule('app:adminRouter');
import { MongoClient } from 'mongodb';
import ramenData from '../data/ramenData.json' with { type: "json" };
import dotenv from 'dotenv';
dotenv.config();

const adminRouter = express.Router();

adminRouter.route('/').get(async (req, res) => {
    const url = process.env.MONGODB_URL;
    const dbName = 'test';
    let client;

    try {
        client = await MongoClient.connect(url);
        debug('Connected to the Mongo DB');
        
        const db = client.db(dbName);
        
        const response = await db.collection('testers').insertMany(ramenData);
        res.json(response); // Send the response data to the client

    } catch (error) {
        
        debug('Failed to insert data:', error.stack);
        res.status(500).json({ error: 'Failed to insert data', details: error.message });

    } finally {
        if (client) {
            await client.close(); // Ensure the client is closed
            debug('MongoDB connection closed');
        }
    }
});

export default adminRouter;