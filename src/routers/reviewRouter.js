
// imports
import express from 'express';
//import reviews from '../data/ramenData.json' with { type: "json" };
import debugModule from 'debug';
const debug = debugModule('app:reviewRouter');
//import pkg from 'mongodb';
//const { MongoClient, ObjectId, ServerApiVersion } = pkg;
import { getReviews, getReviewByObjectID } from '../services/dbService.js';
import dotenv from 'dotenv';
dotenv.config();

// constants
const reviewRouter = express.Router();
/*const url = process.env.MONGODB_URL;
const dbName = 'test';
const collection = 'testers'*/

// make a mongo client
//let client;

// connect to the db
/*async function connectToMongo() {
  if (!client) {
    client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    debug('Connected to the Mongo DB');
  }
  return client;
}*/

reviewRouter.route('').get(async (req, res) => {
    try {
        //const client = await connectToMongo();
        //debug('Connected to the Mongo DB');
        //const db = client.db(dbName);
        const reviews = getReviews();
        reviews.toArray()
        res.render('lets-talk-ramen', {reviews}); // Send the response data to the client
    } catch (error) {
        debug('Failed to insert data:', error.stack);
        res.status(500).json({ error: 'Failed to retrieve data', details: error.message });
    } 
    });

reviewRouter.route('/:id').get(async (req, res) => {
    try {
        const id = req.params.id; // Convert id 
        //const client = await connectToMongo();
        //const db = client.db(dbName);
        //const review = await db.collection(collection).findOne({_id: new ObjectId(id)});
        const review = getReviewByObjectID(new ObjectId(id))
        if (review == null) {
            res.status(500).json({ error: 'Failed to find data'});
        }
        else {
            res.render('review', {review});
        } 
    } catch (error) {
        debug('failed to find object')
        res.status(500).json({ error: 'Failed to find data', details: error.message });
    }
});

export default reviewRouter;