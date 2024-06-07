const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Movies = require('../backend/models/movies');  

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/testDb';

mongoose.connect(MONGO_URL)
  .then(() => {
    console.log('Connection success with database');
  })
  .catch((error) => {
    console.error('Error of connection with database', error);
  });

app.get('/', (req, res) => {
  res.send('Hello Everyone');
});

app.listen(PORT, () => {
  console.log("Server listening on port server " + PORT);
})

// GET 
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movies.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error });
  }
});

// POST 
app.post('/movies', async (req, res) => {
  try {
    const movie = await Movies.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error creating movie', error });
  }
});

// PUT 
app.put('/movies/:id', async (req, res) => {
  try {
    const movie = await Movies.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error });
  }
});

// DELETE 
app.delete('/movies/:id', async (req, res) => {
  try {
    const movie = await Movies.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error });
  }
});


