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
  
});

module.exports = router;
