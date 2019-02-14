const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const muv = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

var schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

schema.plugin(muv);

/** Custom method to create JWT */
schema.methods.genToken = function() {
  let user = this;
  let token = jwt.sign(
    { _id: user._id.toHexString() },
    process.env.JWT_SECRET,
    { expiresIn: 3600 }
  );
  return token;
};

/** Hash password before saving to database */
schema.pre("save", function(next) {
  let user = this;
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (err, hash) => {
      user.password = hash;
      next();
    });
  });
});

/** Used for checking if username & password match db */
schema.statics.findByCredentials = function(username, password) {
  let Admin = this;
  return Admin.findOne({ username }).then(user => {
    if (!user) {
      return Promise.reject("User not found");
    } else {
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) resolve(user);
          reject("Password is incorrect");
        });
      });
    }
  });
};

module.exports = mongoose.model("Admin", schema);
