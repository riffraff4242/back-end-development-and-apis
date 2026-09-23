import express from 'express';

import path from "path";
import { fileURLToPath } from "url";

import weatherRouter from './weather.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

app.get('/api/info', (req, res) => {
  res.json({ 
    name: "Weather API",
    version: "1.0.0",
    endpoints: ["/api/weather/:city", "/api/greet/:name","/api/data"],

   });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'API check was successful' });
});

app.get('/docs', (req, res) => {
  res.redirect('/api/info');
});

app.get('/api/greet/:name', (req, res) => {
  res.json({ greetings: `Hello, ${req.params.name}` });
});

app.route('/api/data')
  .get((req, res) => {
    res.json({ message: 'Data retrieved Succesfully' });
  })
  .post((req, res) => {
    res.status(201).json({ message: 'Data created succesfully' });
  });

app.use('/api/weather', weatherRouter);



app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});