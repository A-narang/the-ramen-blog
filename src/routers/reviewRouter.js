import express from 'express';
import reviews from '../data/ramenData.json' with { type: "json" };

const reviewRouter = express.Router();

reviewRouter.route('').get((req, res) => {
    res.render('lets-talk-ramen', {
        reviews
    });
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