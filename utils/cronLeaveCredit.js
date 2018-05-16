const cron = require('node-cron');

const User = require('../models/user');

/**
 * CRON job that adds 2.15 leave credits to all registered users every month
 */
const cronLeave = cron.schedule('* * 1 */1 *', async () => {
  try {
    await User.updateMany(
      {},
      {$inc: {leaveCredits: 2.15}}
    ).then(console.log('Leave credits updated.'));
  } catch (error) {
    console.log(error);
  }
}, false);

module.exports = cronLeave;
