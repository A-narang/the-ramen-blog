import express from 'express';
//import reviews from '../data/ramenData.json' with { type: "json" };
import debugModule from 'debug';
const debug = debugModule('app:reviewRouter');
import pkg from 'mongodb';
const { MongoClient, ObjectId, ServerApiVersion } = pkg;
import dotenv from 'dotenv';
dotenv.config();

const reviewRouter = express.Router();

const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version and SSL options
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
    ssl: true,
    // Uncomment and specify the CA file path if using self-signed certificates
    // sslCA: fs.readFileSync('/path/to/ca-certificate.crt'),
    // sslValidate: false // Disable SSL validation (for testing only)
  });

reviewRouter.route('').get(async (req, res) => {

    const dbName = 'ramenTest';

    try {
        await client.connect();
        debug('Connected to the Mongo DB');
        const db = client.db(dbName);
        const reviews = await db.collection('realData').find().toArray();
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
        res.render('lets-talk-ramen', {reviews}); // Send the response data to the client
    } catch (error) {
        debug('Failed to insert data:', error.stack);
        res.status(500).json({ error: 'Failed to retrieve data', details: error.message });
    } finally {
        if (client) {
            await client.close(); // Ensure the client is closed in the finally block
            debug('MongoDB connection closed');
        }
    }
});

reviewRouter.route('/:id').get((req, res) => {
    const id = req.params.id; // Convert id to an index
    const review = reviews[id]; // Get the order using the ID
    if (review) {
        res.render('view-request');
    } else {
        res.status(404).send('Review not found');
    }
});

export default reviewRouter;