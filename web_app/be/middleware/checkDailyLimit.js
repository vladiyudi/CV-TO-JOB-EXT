const User = require('../models/User');

const checkDailyLimit = async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const today = new Date().setHours(0, 0, 0, 0);
  const userDoc = await User.findById(user._id);

  if (userDoc.dailyLimit === null) {
    // User has unlimited generations
    return next();
  }

  if (userDoc.lastResetDate.setHours(0, 0, 0, 0) < today) {
    // Reset daily count if it's a new day
    userDoc.generationsToday = 0;
    userDoc.lastResetDate = new Date();
  }

  if (userDoc.generationsToday >= userDoc.dailyLimit) {
    return res.status(429).json({ message: 'Daily generation limit reached' });
  }

  userDoc.generationsToday += 1;
  await userDoc.save();

  next();
};

module.exports = checkDailyLimit;
