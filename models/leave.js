const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

var schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
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
  },
  type: {
    type: String,
    required: true
  }
});

// makes sure that the removed date is also removed from the User's leave array
schema.post('remove', function (leave) {
  User.findById(leave.userId, function (err, user) {
    user.filedLeaves.pull(leave._id);
    user.save();
  });
});

module.exports = mongoose.model('Leave', schema);