const jwt = require('jsonwebtoken');
const user = require('../../models/user');

async function getMe(context) {
  if (!context.token) {
    throw new Error('Not authenticated');
  }

  const decoded = jwt.verify(
    context.token.replace('Bearer ', ''),
    process.env.JWT_SECRET
  );

  const User = await user
    .findById(decoded.userId)
    .populate('friends', 'id name email avatar')
    .populate('blockedUsers', 'id name email avatar');

  if (!User) throw new Error('User not found');

  return User;
}

module.exports = { getMe };
