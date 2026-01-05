const User = require('../../models/user');

async function getUserProfile(_, { userId }, context) {
  const viewerId = context.userId;

  const user = await User.findById(userId).populate('friends', '_id').lean();

  if (!user) throw new Error('User not found');

  const isOwner = viewerId && viewerId === userId;
  const friend = viewerId ? isFriend(user, viewerId) : false;

  let profile = {
    id: user._id,
    name: user.name,
    avatar: user.avatar,
  };

  if (
    isOwner ||
    user.storyPrivacy === 'public' ||
    (user.storyPrivacy === 'friends' && friend)
  ) {
    profile.bio = user.bio;
    profile.voiceIntro = user.voiceIntro;
  }

  return profile;
}

function isFriend(user, viewerId) {
  return user.friends.some(id => id.toString() === viewerId.toString());
}


module.exports = getUserProfile;
