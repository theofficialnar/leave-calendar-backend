const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const muv = require("mongoose-unique-validator");

const { ObjectID } = require("mongodb");

var schema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    leaveCredits: {
      type: Number
    },
    filedLeaves: [
      {
        type: Schema.Types.ObjectId,
        ref: "Leave"
      }
    ]
  },
  {
    usePushEach: true
  }
);

schema.plugin(muv);

schema.pre("remove", function(next) {
  const Leave = require("./leave");
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

module.exports = mongoose.model("User", schema);
