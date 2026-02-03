const user = require('../../models/user');

async function getUserProfile(_, { userId }, context) {
  if (!context.userId) throw new Error('Unauthorized');

  const tergetUser = await user
    .findById(userId)
    .populate('friends', '_id')
    .lean();

  if (!tergetUser) throw new Error('User not found');

  const friend = context.userId ? isFriend(tergetUser, context.userId) : false;

  let profile = {
    id: tergetUser._id,
    name: tergetUser.name,
    avatar: tergetUser.avatar,
    bio: tergetUser.bio,
  };

  if (tergetUser.OwnVoicePrivacy === 'friends' && friend) {
    profile = { ...profile, voiceIntro: tergetUser.voiceIntro };
  }
  if (tergetUser.OwnVoicePrivacy === 'public') {
    profile = { ...profile, voiceIntro: tergetUser.voiceIntro };
  }
  return profile;
}

function isFriend(user, viewerId) {
  return user.friends.some(id => id.toString() === viewerId.toString());
}

module.exports = getUserProfile;
