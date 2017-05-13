'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const log = require('../../logger');
const uniqueValidator = require('mongoose-unique-validator');

const generate_sid = function(){
		const sha = crypto.createHash('sha256');
	    sha.update(Math.random().toString());
	    return sha.digest('hex');
	}

const SessionSchema = new Schema({
  user_id: {type: String, default:''},
  session_id: {type: String, unique: true, default: generate_sid}
});

SessionSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Session', SessionSchema);