const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteSchema = new Schema({
  ID: {
    type: String,
    required: true
  },
  temp: {
    type: Number,
    required: true
  }

});

// Create collection and add schema
const Vote = mongoose.model('Vote', VoteSchema);

module.exports = Vote;
