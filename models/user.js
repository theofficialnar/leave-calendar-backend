const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const muv = require('mongoose-unique-validator');

var schema = new Schema({
  fullName: {
    type: String,
    required: true,
    unique: true
  },
  leaveCredits: {
    type: Number
  },
  filedLeaves: [{
    type: Schema.Types.ObjectId,
    ref: 'Leave'
  }]
}, {
  usePushEach: true
});

schema.plugin(muv);

module.exports = mongoose.model('User', schema);