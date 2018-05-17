const express = require('express');
const router = express.Router();

const Admin = require('../models/admin');

/** Create admin account */
router.post('/', async (req, res, next) => {
  let newAdmin = new Admin({
    userName: req.body.userName,
    password: req.body.password
  });

  try {
    let mongoUpload = await newAdmin.save();
    res.status(201).json({
      message: 'Admin account created',
      data: mongoUpload
    });
  } catch (error) {
    next(error);
  }
});

/** Log in */
router.post('/signin', async (req, res, next) => {
  try {
    let user = await Admin.findByCredentials(req.body.userName, req.body.password);
    let token = await user.genToken();
    res.status(200).json({
      message: 'Log in successful',
      token,
      user: user._id
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
