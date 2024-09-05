import pkg from 'mongodb';
const { MongoClient, ObjectId, ServerApiVersion } = pkg;

import dotenv from 'dotenv'
dotenv.config()
const url = process.env.MONGODB_URL

import debugModule from 'debug';
const debug = debugModule('app');

const dbName = 'test';
const collectionName = 'testers'

let client;
let db;

async function connectToMongo() {
    if (!client) {
        client = new MongoClient(url, { useUnifiedTopology: true });
        try {
            await client.connect();
            debug('Connected to the Mongo DB');
            db = client.db(dbName)
        }
        catch (e) {
            debug('Failed to connect to Mongo DB')
            console.log(e)
        }
    }
    return client;
};


export const getUserByUsername = async (username) => {
    return await db.collection(collectionName).findOne({ username });
};

export const createUser = async (username, hashedPassword, salt) => {
    await connectToMongo();
    const newUser = { username, hashedPassword, salt}
    return await db.collection(collectionName).insertOne({ username, hashed_password: hashedPassword, salt });
};

export const verifyUser = async (username, password, cb) => {
    dbName
    await connectToMongo();
    return await passport.use(new LocalStrategy(function verify(username, password, cb) {
        const collection = db.collection(collectionName);

        collection.findOne({ username: username }, function (err, user) {
            if (err) { return cb(err); }
            if (!user) { return cb(null, false, { message: 'Incorrect username or password.' }); }

            crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
                if (err) { return cb(err); }
                if (!crypto.timingSafeEqual(user.hashed_password.buffer, hashedPassword)) {
                    return cb(null, false, { message: 'Incorrect username or password.' });
                }
                return cb(null, user);
            });
        });
    }));
};

export const insertNewReview = async (ramenName, date, image, rating, text) => {
    await connectToMongo();
    const newReview = { ramenName, date, image, rating, text }
    return await db.collection(collectionName).insertOne(newReview);
};

export const getReviews = async () => {
    await connectToMongo();
    return await db.collection(collectionName).find().toArray();
}

export const getReviewByObjectID = async (objID) => {
    await connectToMongo();
    return await db.collection(collection).findOne({_id: objID});
}