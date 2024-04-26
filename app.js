// in app.js
import express from 'express';
import chalk from 'chalk';
import debug from 'debug';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.env.PORT || 3000;
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/public')));

app.set('views', './src/views');
app.set('view engine', 'ejs');
app.get('/',(req, res)=>{
	res.render('index');
});
app.get('/about-us',(req, res)=>{
	res.render('about-us');
});
app.get('/lets-talk-ramen',(req, res)=>{
	res.render('lets-talk-ramen');
});
app.get('/review',(req, res)=>{
	res.render('review');
});

// listen on a port
app.listen(PORT, () => {
    debug(`Listening on port ${chalk.green(PORT)}`);
});
