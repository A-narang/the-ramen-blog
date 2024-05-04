import express from 'express';

const reviewRouter = express.Router();

reviewRouter.route('/').get((req, res) => {
    res.render('lets-talk-ramen', {
        orders
    });
});
reviewRouter.route('/:id').get((req, res) => {
    const id = req.params.id - 1; // Convert id to an index
    res.render('review');
    //const order = orders.orders[id]; // Get the order using the ID
    /*if (order) {
        res.render('view-request');
    } else {
        res.status(404).send('Review not found');
    }*/
});

export default reviewRouter;