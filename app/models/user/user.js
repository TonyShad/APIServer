'use strict';

const mongoose = require('mongoose');
const crypto = require('crypto');
const Schema = mongoose.Schema;
const log = require('../../logger');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = new Schema({
  email: { type: String, index: true, unique: true, required: true, default: '' },
  hashed_password: { type: String, required: true },
  salt: { type: String, default: '' },
  decks: [{_id: false, name: {type: String, required: false, uniquie: false}}]

});

UserSchema.plugin(uniqueValidator);

UserSchema
    .virtual('password')
    .set(function (password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encryptPassword(password);
    })
    .get(function () {
        return this._password;
    });

UserSchema.path('email').validate(function (email) {

  return email.length;
}, 'Email cannot be blank');


UserSchema.path('hashed_password').validate(function (hashed_password) {

  return hashed_password.length && this._password.length;
}, 'Password cannot be blank');

UserSchema.methods = {

  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function () {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  },

  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      return '';
    }
  },

  /**
   * Validation is not required if using OAuth
   */

};

module.exports = mongoose.model('User', UserSchema);

