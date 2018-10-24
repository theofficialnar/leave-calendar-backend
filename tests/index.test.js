const mongoose = require("mongoose");

beforeAll(done => {
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].deleteMany({});
  }
  console.log("Test database cleared. Ready to run test suite.");
  done();
});

require("./admin-test");
require("./env-test");
