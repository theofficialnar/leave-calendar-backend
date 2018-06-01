const cron = require('node-cron');

const User = require('../models/user');

/**
 * CRON job that adds 2.15 leave credits to all registered users every month
 * Runs every 1:00 AM every first day of the month
 */
const cronLeave = cron.schedule('00 01 01 1-12 *', function () {
  try {
    User.updateMany(
      {},
      {$inc: {leaveCredits: 2.15}}
    ).then(console.log('Leave credits updated.'));
  } catch (error) {
    console.log(error);
  }
}, false);

module.exports = cronLeave;
