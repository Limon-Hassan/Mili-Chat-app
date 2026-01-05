const user = require('../../models/user');
const Story = require('../../models/storyModel');

async function getUserStories(_, { userId }, context) {
  const viewerId = context.userId;

  const user = await user.findById(userId).lean();
  if (!user) throw new Error('User not found');

  const isOwner = viewerId && viewerId === userId;
  const friend = viewerId ? isFriend(user, viewerId) : false;

  if (user.storyPrivacy === 'onlyme' && !isOwner) {
    return [];
  }

  if (user.storyPrivacy === 'friends' && !isOwner && !friend) {
    return [];
  }

  return await Story.find({ user: userId }).sort({ createdAt: -1 });
}

function isFriend(user, viewerId) {
  return user.friends.some(id => id.toString() === viewerId.toString());
}

module.exports = getUserStories;
