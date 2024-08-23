// imports
import express from 'express';
import debugModule from 'debug';
import dotenv from 'dotenv';
import passport from 'passport';
import pkg from 'mongodb';
import { Strategy as LocalStrategy } from "passport-local";
import crypto from 'crypto'

import { createUser } from '../services/dbService.js';

const debug = debugModule('app:authRouter');
const { MongoClient } = pkg;

dotenv.config();

// constants
const authRouter = express.Router();
const url = process.env.MONGODB_URL;
const dbName = 'db';
const collectionName = 'users'

// passport config
/*
passport.use(new LocalStrategy(function verify(username, password, cb) {
    db.get('SELECT * FROM users WHERE username = ?', [username], function (err, row) {
        if (err) { return cb(err); }
        if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }

        crypto.pbkdf2(password, row.salt, 310000, 32, 'sha256', function (err, hashedPassword) {
            if (err) { return cb(err); }
            if (!crypto.timingSafeEqual(row.hashed_password, hashedPassword)) {
                return cb(null, false, { message: 'Incorrect username or password.' });
            }
            return cb(null, row);
        });
    });
}));
*/

let db;

// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        debug('Connected to database');

        // Now configure Passport strategy
        passport.use(new LocalStrategy(function verify(username, password, cb) {
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

    })
    .catch(err => debug('Failed to connect to database', err));

authRouter.post('/sign-in/password', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/sign-in'
}));

authRouter.get('/sign-in', (req, res) => {
    res.render('sign-in')
})

authRouter.get('/sign-up', (req, res) => {
    res.render('sign-up')
})

// form submission route
authRouter.post('/submit', async (req, res) => {
    console.log('Headers:', req.headers);
    console.log('req.body:', req.body);
  
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ error: 'No data received in request body' });
    }
  
    try {
      const { ramenName, date, image, rating, text } = req.body;
  
      // Check if all required fields are present
      const requiredFields = ['ramenName', 'date', 'image', 'rating', 'text'];
  
      for (let field of requiredFields) {
        if (!req.body[field]) {
          return res.status(400).json({ error: `Missing required field: ${field}` });
        }
      }
  
      insertNewReview(ramenName, date, image, rating, text)
  
      res.redirect('/');
    } catch (error) {
      debug('Failed to insert data:', error.stack);
      res.status(500).json({ error: 'Failed to insert data', details: error.message });
      console.log(error.message);
    }
  });

export default authRouter;