const mongoose = require('mongoose');

const moviesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  creator: { type: String, required: true },
  studio: { type: String, required: true }
});

const Movies = mongoose.model('Movies', moviesSchema);

module.exports = Movies;
