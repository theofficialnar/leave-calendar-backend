const express = require("express");
const router = express.Router();
const { ObjectID } = require("mongodb");

const User = require("../models/user");
const authenticate = require("../middleware/authenticate");

/** Get all users */
router.get("/", async (req, res, next) => {
  try {
    let allUsers = await User.find();
    res.status(200).json({
      message: "All users fetched",
      data: allUsers
    });
  } catch (error) {
    next(error);
  }
});

/** Get a specific user's info */
router.get("/:userId", async (req, res, next) => {
  if (!ObjectID.isValid(req.params.userId)) {
    let err = new Error("Invalid user ID");
    return next(err);
  }

  try {
    let user = await User.findById(req.params.userId);
    if (user === null) {
      let err = new Error("User does not exist");
      return next(err);
    }
    res.status(200).json({
      message: "User info fetched",
      data: user
    });
  } catch (error) {
    next(error);
  }
});

/******************* ROUTES REQUIRING ADMIN RIGHTS ***************/
/** Update user info */
router.patch("/:userId", authenticate, async (req, res, next) => {
  if (!ObjectID.isValid(req.params.userId)) {
    let err = new Error("ID does not exist");
    return next(err);
  }

  try {
    let toUpdate = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true
    });
    res.status(200).json({
      message: "User updated",
      data: toUpdate
    });
  } catch (error) {
    next(error);
  }
});

/** Add a new user */
router.post("/", authenticate, async (req, res, next) => {
  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    team: req.body.team,
    brand: req.body.brand,
    leaveCredits: req.body.leaveCredits || 0
  });

  try {
    let mongoUpload = await newUser.save();
    res.status(201).json({
      message: "User created",
      data: mongoUpload
    });
  } catch (error) {
    next(error);
  }
});

/** Remove user */
router.delete("/:userId", authenticate, async (req, res, next) => {
  if (!ObjectID.isValid(req.params.userId)) {
    let err = new Error("Invalid user ID");
    return next(err);
  }

  try {
    let userId = await User.findById(req.params.userId);
    if (userId === null) {
      let err = new Error("ID not found");
      next(err);
    }
    let toDelete = await userId.remove();
    res.status(200).json({
      message: "User removed",
      data: toDelete
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
