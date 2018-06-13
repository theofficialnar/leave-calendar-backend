const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const Leave = require('../models/leave');
const User = require('../models/user');

/** Post a new leave */
router.post('/', async (req, res, next) => {
  const user = await User.findById(req.body.userId);
  let newLeave = new Leave ({
    userId: user._id,
    status: req.body.status,
    type: req.body.type,
    start: req.body.start,
    end: req.body.end
  });
  try {
    let mongoUpload = await newLeave.save();

    /** Push the newly added leave to the user's filedLeaves array */
    user.filedLeaves.push(mongoUpload);
    let newCredits = user.leaveCredits - req.body.toDeduct;
    user.leaveCredits = newCredits;
    user.save();

    res.status(201).json({
      message: 'Leave added',
      data: mongoUpload
    });
  } catch (error) {
    next(error);
  }
});

/** Delete a specific leave */
router.delete('/:leaveId', async (req, res, next) => {
  if (!ObjectID.isValid(req.params.leaveId)) {
    let err = new Error('Invalid ID');
    return next(err);
  }
  
  try {
    let leaveId = await Leave.findById(req.params.leaveId);
    if (leaveId === null) {
      let err = new Error('ID not found');
      return next(err);
    } else if (leaveId.userId != req.body.userId) {
      let err = new Error('Unable to delete leaves not filed by you');
      return next(err);
    } else {
      /** Refund leave credits */
      const user = await User.findById(leaveId.userId);
      let newCredits = user.leaveCredits + Number(req.body.toAdd);
      user.leaveCredits = newCredits;
      user.save();
  
      let toDelete = await leaveId.remove();
      res.status(200).json({
        message: 'Leave removed',
        data: toDelete
      });
    }
  } catch (error) {
    next(error)
  }
});

/**  Update a specific leave */
router.patch('/:leaveId', async (req, res, next) => {
  if (!ObjectID.isValid(req.params.leaveId)) {
    let err = new Error('ID does not exist');
    return next(err);
  }

  try {
    let toUpdate = await Leave.findByIdAndUpdate(req.params.leaveId, req.body, {new: true});
    res.status(200).json({
      message: 'Leave updated',
      data: toUpdate
    });
  } catch (error) {
    next(error);
  }
});

/** Get all leaves */
router.get('/', async (req, res, next) => {
  try {
    let allLeaves = await Leave.find().populate('userId');
    res.status(200).json({
      message: 'All leaves fetched',
      data: allLeaves
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
