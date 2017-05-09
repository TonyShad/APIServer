'use strict';
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TestSchema = new Schema({
  name: { type: String, index: true, default: ''},

  
});

module.exports = mongoose.model('Test', TestSchema);

