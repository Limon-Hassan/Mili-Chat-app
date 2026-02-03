const user = require('../../models/user');

async function getUserFriends(_, { userId }, context) {
  if (!context.userId) {
    throw new Error('Unauthorized');
  }

  const tergetUser = await user
    .findById(userId)
    .populate('friends', '_id name avatar')
    .lean();

  if (!tergetUser) throw new Error('User not found');

  const friend = context.userId ? isFriend(tergetUser, context.userId) : false;

  if (tergetUser.friendListPrivacy === 'friends' && friend) {
    return tergetUser.friends;
  }

  if (tergetUser.friendListPrivacy === 'public') {
    return tergetUser.friends;
  }

  return [];
}

function isFriend(user, viewerId) {
  return user.friends.some(f => f._id.toString() === viewerId.toString());
}

module.exports = getUserFriends;
