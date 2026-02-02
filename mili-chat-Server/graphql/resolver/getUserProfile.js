const user = require('../../models/user');

async function getUserProfile(_, { userId }, context) {
  const viewerId = context?.userId;

  const tergetUser = await user
    .findById(userId)
    .populate('friends', '_id')
    .lean();

  if (!tergetUser) throw new Error('User not found');

  const isOwner = viewerId && viewerId === userId;
  const friend = viewerId ? isFriend(tergetUser, viewerId) : false;

  let profile = {
    id: tergetUser._id,
    name: tergetUser.name,
    avatar: tergetUser.avatar,
  };

  if (
    isOwner ||
    tergetUser.storyPrivacy === 'public' ||
    (tergetUser.storyPrivacy === 'friends' && friend)
  ) {
    profile.bio = tergetUser.bio;
    profile.voiceIntro = tergetUser.voiceIntro;
  }

  return profile;
}

function isFriend(user, viewerId) {
  return user.friends.some(id => id.toString() === viewerId.toString());
}

module.exports = getUserProfile;
