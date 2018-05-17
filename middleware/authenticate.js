const jwt = require('jsonwebtoken');

/** Middleware to make routes private */
const authenticate = (req, res, next) => {
  let token = req.header('x-auth');
  try {
    let verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      let err = new Error('Invalid JWT. Please relogin');
      return next(err);
    }
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = authenticate;