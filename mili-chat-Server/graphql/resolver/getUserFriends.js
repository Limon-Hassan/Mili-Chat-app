const user = require('../../models/user');

async function getUserFriends(_, { userId }, context) {
  const viewerId = context.userId;

  const tergetUser = await user
    .findById(userId)
    .populate('friends', 'name avatar')
    .lean();

  if (!tergetUser) throw new Error('User not found');

  const isOwner = viewerId && viewerId === userId;
  const friend = viewerId ? isFriend(tergetUser, viewerId) : false;

  if (user.friendListPrivacy === 'onlyme' && !isOwner) {
    return [];
  }

  if (tergetUser.friendListPrivacy === 'friends' && !isOwner && !friend) {
    return [];
  }

  return tergetUser.friends;
}

function isFriend(user, viewerId) {
  return user.friends.some(id => id.toString() === viewerId.toString());
}


module.exports = getUserFriends;
