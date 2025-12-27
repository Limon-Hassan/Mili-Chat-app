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

  const user = await user.findById(decoded.userId);
  if (!user) throw new Error('User not found');

  return user;
}

module.exports = { getMe };
