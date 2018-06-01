const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const muv = require('mongoose-unique-validator');
const Leave = require('./leave');
const { ObjectID } = require('mongodb');

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

schema.pre('remove', function (next) {
  let user = this;
  let toDelete = [];
  user.filedLeaves.forEach(function(item) {
    Leave.findByIdAndRemove(new ObjectID(item), (err, succ) => {
      if (succ) {
        console.log(`${item} Deleted`);
      }
    });
  });
  next();
});

module.exports = mongoose.model('User', schema);