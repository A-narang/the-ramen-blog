
// imports
import express from 'express';
//import reviews from '../data/ramenData.json' with { type: "json" };
import debugModule from 'debug';
const debug = debugModule('app:reviewRouter');
import pkg from 'mongodb';
const { MongoClient, ObjectId, ServerApiVersion } = pkg;
import dotenv from 'dotenv';
dotenv.config();

// constants
const formRouter = express.Router();
const url = process.env.MONGODB_URL;
const dbName = 'test';
const collection = 'testers'

// make a mongo client
let client;

// connect to the db
async function connectToMongo() {
  if (!client) {
    client = new MongoClient(url, { useUnifiedTopology: true });
    await client.connect();
    debug('Connected to the Mongo DB');
  }
  return client;
}

formRouter.get('',(req, res)=>{
	res.render('form');
});

// form submission route
formRouter.post('/submit', async (req, res) => {
    console.log('req.body:', req.body);
    // req.body is undefinied rn when you try to submit, look into why
    const {ramenName, reviewer1Name, reviewer2Name, reviewDate, rating1, rating2,
      reviewText1, reviewText2, reviewImage} = req.body;
    
    const newReview = {
      ramenName: ramenName,
      reviewer1Name: reviewer1Name,
      reviewer2Name: reviewer2Name,
      reviewDate: reviewDate,
      rating1: rating1,
      rating2: rating2,
      reviewText1: reviewText1,
      reviewText2: reviewText2,
      reviewImage: reviewImage
    };
  
    try {
      const client = await connectToMongo();
      const db = client.db(dbName);
      const info = await db.collection(collection);
      await info.insertOne(newReview);
      res.redirect('/');
    } catch (error) {
      debug('Failed to insert data:', error.stack);
      res.status(500).json({ error: 'Failed to insert data', details: error.message });
      console.log(error.message)
    }
  });

export default formRouter;