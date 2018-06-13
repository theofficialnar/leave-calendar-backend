const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  }
});

// makes sure that the removed date is also removed from the User's leave array
schema.pre('remove', function (next) {
  const User = require('./user');
  let leave = this;
  User.findById(leave.userId, function (err, user) {
    user.filedLeaves.pull(leave._id);
    user.save();
  });
  next();
});

module.exports = mongoose.model('Leave', schema);