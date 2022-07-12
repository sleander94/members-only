var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  author: { type: String, required: true },
  timestamp: { type: String, required: true },
  title: { type: String, required: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Message', MessageSchema);
