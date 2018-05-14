const express = require('express');
const router = express.Router();

const Leave = require('../models/leave');
const User = require('../models/user');

/** Post a new leave */
router.post('/', async (req, res, next) => {
  try {
    const user = await User.findById(req.body.userId);
    let newLeave = new Leave ({
      userId: user._id,
      status: req.body.status,
      start: req.body.start,
      end: req.body.end
    });
    let mongoUpload = await newLeave.save();

    /** Push the newly added leave to the user's filedLeaves array */
    user.filedLeaves.push(mongoUpload);
    user.save();

    res.status(201).json({
      message: 'Leave successfully added',
      data: mongoUpload
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
