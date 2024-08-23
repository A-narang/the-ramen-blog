// imports
import express from 'express';
import debugModule from 'debug';
const debug = debugModule('app:reviewRouter');
import { insertNewReview } from '../services/dbService.js';
import dotenv from 'dotenv';
dotenv.config();

const formRouter = express.Router();

formRouter.get('', (req, res) => {
  res.render('form');
});

// form submission route
formRouter.post('/submit', async (req, res) => {
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

export default formRouter;