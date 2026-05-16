const mongoose = require('mongoose');

const filmeSchema = new mongoose.Schema({

    id: {
    type: Number,
    required: true,
    unique: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  year: {
    type: Number,
    required: true
  },

  genres: {
    type: [String],
    required: true
  },

  image: {
    type: String,
    required: true
  },

  video: {
    type: String,
    required: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Filme', filmeSchema);