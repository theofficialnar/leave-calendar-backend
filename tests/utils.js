const mongoose = require("mongoose");

const clearDB = () => {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany({});
  }
};

module.exports = { clearDB };
