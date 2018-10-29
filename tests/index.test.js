const mongoose = require("mongoose");

afterAll(() => {
  return mongoose.connection.db.dropDatabase().then(() => {
    console.log("Test database dropped.");
    return mongoose.connection.close();
  });
});

require("./admin-test");
require("./env-test");
