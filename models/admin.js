const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const muv = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

var schema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});

schema.plugin(muv);

/** Custom method to create JWT */
schema.methods.genToken = () => {

}

/** Hash password before saving to database */
schema.pre('save', function (next) {
  let user = this;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('Admin', schema);
