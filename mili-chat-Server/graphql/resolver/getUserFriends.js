const user = require('../../models/user');

async function getUserFriends(_, { userId }, context) {
  const viewerId = context.userId;

  const user = await user
    .findById(userId)
    .populate('friends', 'name avatar')
    .lean();

  if (!user) throw new Error('User not found');

  const isOwner = viewerId && viewerId === userId;
  const friend = viewerId ? isFriend(user, viewerId) : false;

  if (user.friendListPrivacy === 'onlyme' && !isOwner) {
    return [];
  }

  if (user.friendListPrivacy === 'friends' && !isOwner && !friend) {
    return [];
  }

  return user.friends;
}

function isFriend(user, viewerId) {
  return user.friends.some(id => id.toString() === viewerId.toString());
}


module.exports = getUserFriends;
