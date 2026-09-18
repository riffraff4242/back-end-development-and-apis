import express from 'express';
import { inputCleaner, inputValidator } from './middleware.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Put the root redirect BEFORE express.static
app.get('/', (req, res) => {
  res.redirect('/form');
});

app.use(express.static('public'));

app.get('/form', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

app.post('/submit', inputCleaner, inputValidator, (req, res) => {
  res.json({
    username: req.body.username,
    comment: req.body.comment
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});