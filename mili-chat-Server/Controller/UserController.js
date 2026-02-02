const user = require('../models/user');
const { getIO, getSocketIds } = require('../socket_server');

async function uploadProfilePic({ profilePic }, context) {
  if (!context.userId) throw new Error('Authentication required');

  const updatedUser = await user.findByIdAndUpdate(
    context.userId,
    { avatar: profilePic },
    { new: true },
  );

  const io = getIO();
  getSocketIds(context.userId).forEach(sid => {
    io.to(sid).emit('profileUpdated', {
      avatar: updatedUser.avatar,
    });
  });
  return updatedUser;
}

async function updateProfile({ name, bio }, context) {
  if (!context.userId) throw new Error('Authentication required');
  const updateData = {};
  if (name !== undefined && name !== '') updateData.name = name;
  if (bio !== undefined && bio !== '') updateData.bio = bio;
  const updatedUser = await user.findByIdAndUpdate(context.userId, updateData, {
    new: true,
  });
  let io = getIO();

  getSocketIds(context.userId).forEach(sid => {
    io.to(sid).emit('profileUpdated', {
      name: updatedUser.name,
      bio: updatedUser.bio,
    });
  });
  return updatedUser;
}

async function AddOwnVoice({ voice }, context) {
  if (!context.userId) throw new Error('Authentication required');
  const updatedUser = await user.findByIdAndUpdate(
    context.userId,
    { voiceIntro: { url: voice } },
    { new: true },
  );
  let io = getIO();
  getSocketIds(context.userId).forEach(sid => {
    io.to(sid).emit('profileUpdated', {
      voiceIntro: updatedUser.voiceIntro,
    });
  });
  return updatedUser;
}

async function updatePrivacy(
  { storyPrivacy, friendPrivacy, ownVoicePrivacy, profilePicLock },
  context,
) {
  if (!context.userId) throw new Error('Authentication required');

  let updateObj = {};
  if (storyPrivacy !== undefined && storyPrivacy !== '')
    updateObj.storyPrivacy = storyPrivacy;
  if (friendPrivacy !== undefined && friendPrivacy !== '')
    updateObj.friendListPrivacy = friendPrivacy;
  if (ownVoicePrivacy !== undefined && ownVoicePrivacy !== '')
    updateObj.OwnVoicePrivacy = ownVoicePrivacy;
  if (profilePicLock !== undefined && profilePicLock !== '') {
    updateObj.ProfilePicLock = profilePicLock;
  }
 

  const updatedUser = await user.findByIdAndUpdate(context.userId, updateObj, {
    new: true,
  });

  return updatedUser;
}

module.exports = {
  uploadProfilePic,
  updateProfile,
  AddOwnVoice,
  updatePrivacy,
};
