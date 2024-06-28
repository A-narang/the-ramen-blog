
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

formRouter.get('/form',(req, res)=>{
	res.render('form');
});

// form submission route
formRouter.post('/submit', async (req, res) => {
    console.log('req.body:', req.body);
    const { name, logo_url, desc, active } = req.body;
    
    const newReview = {
      name: ramenName,
      ramentext1: RamenText1
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
    }
  });

export default formRouter;