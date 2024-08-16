// in app.js
import express from 'express';
import chalk from 'chalk';
import debug from 'debug';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

// this is the middleware
// before the data gets sent to its final destination via its corresponding
// route, the middleware retrieves/handles/processes the data first

// this is what allowed req.body, used in formRouter.js, to not be empty.
const PORT = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import reviewRouter from './src/routers/reviewRouter.js';
import formRouter from './src/routers/formRouter.js';
import authRouter from './src/routers/authRouter.js'

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));

// routers
app.use('/reviews', reviewRouter);
app.use('/form', formRouter); // uses form router to navigate to form
app.use('/auth', authRouter)

// setting up the view
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
	res.render('index');
});
app.get('/about-us', (req, res) => {
	res.render('about-us');
});

// listen on a port
app.listen(PORT, () => {
	debug(`Listening on port ${chalk.green(PORT)}`);
});
