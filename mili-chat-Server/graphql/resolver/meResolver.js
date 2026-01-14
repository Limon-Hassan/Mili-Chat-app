const jwt = require('jsonwebtoken');
const user = require('../../models/user');
const storyModel = require('../../models/storyModel');

async function getMe(context) {
  if (!context.accessToken) {
    throw new Error('Not authenticated');
  }

  const decoded = jwt.verify(
    context.accessToken.replace('Bearer ', ''),
    process.env.JWT_SECRET
  );

  const User = await user
    .findById(decoded.userId)
    .populate('friends', 'id name email avatar')
    .populate('blockedUsers', 'id name email avatar')
    .lean();
  User.friends = User.friends || [];
  User.blockedUsers = User.blockedUsers || [];

  if (!User) throw new Error('User not found');

  const stories = await storyModel
    .find({ user: User._id })
    .populate('stories.seenBy.user', 'id name avatar')
    .sort({ createdAt: -1 })
    .lean();

  User.stories = stories;

  return User;
}

module.exports = { getMe };
