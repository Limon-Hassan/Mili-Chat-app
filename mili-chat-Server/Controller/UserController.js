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
  const updatedUser = await user.findByIdAndUpdate(
    context.userId,
    { name, bio },
    { new: true },
  );
  let io = getIO();

  getSocketIds(context.userId).forEach(sid => {
    io.to(sid).emit('profileUpdated', {
      name: updatedUser.name,
      bio: updatedUser.bio,
    });
  });
  return updatedUser;
}

async function AddOwnVoice({ voice, duration }, context) {
  if (!context.userId) throw new Error('Authentication required');
  const updatedUser = await user.findByIdAndUpdate(
    context.userId,
    { voiceIntro: { url: voice, duration } },
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

async function StoryPrivacy({ statusVisibility }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  let updatedUser = await user.findByIdAndUpdate(
    context.userId,
    {
      storyPrivacy: statusVisibility,
    },
    { new: true },
  );

  return updatedUser;
}

async function FriendPrivacy({ friendListVisibility }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  let updatedUser = await user.findByIdAndUpdate(
    context.userId,
    {
      friendListPrivacy: friendListVisibility,
    },
    { new: true },
  );
  return updatedUser;
}

async function OwnVoicePrivacy({ OwnVoicePrivacy }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  let updatedUser = await user.findByIdAndUpdate(
    context.userId,
    {
      OwnVoicePrivacy: OwnVoicePrivacy,
    },
    { new: true },
  );
  return updatedUser;
}

module.exports = {
  uploadProfilePic,
  updateProfile,
  AddOwnVoice,
  StoryPrivacy,
  FriendPrivacy,
  OwnVoicePrivacy,
};
