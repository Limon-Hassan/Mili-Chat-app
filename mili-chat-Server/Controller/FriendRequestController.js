const friendRequest = require('../models/friendRequest');
const user = require('../models/user');
const { createNotify } = require('./NotificationContoller');

async function sendFriendRequest({ toUserId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  if (context.userId === toUserId) {
    throw new Error('Cannot send friend request to yourself');
  }

  const toUser = await user.findById(toUserId);
  if (!toUser) {
    throw new Error('User not found');
  }

  const me = await user.findById(context.userId);

  if (me.friends?.includes(toUserId)) {
    throw new Error('User is already your friend');
  }

  if (me.blockedUsers?.includes(toUserId)) {
    throw new Error('Unblock user first to send friend request');
  }

  if (toUser.blockedUsers?.includes(context.userId)) {
    throw new Error('You are blocked by this user');
  }

  const existingRequest = await friendRequest.findOne({
    status: 'pending',
    $or: [
      { from: context.userId, to: toUserId },
      { from: toUserId, to: context.userId },
    ],
  });

  if (existingRequest) {
    throw new Error('Friend request already exists between you two');
  }

  const newRequestDoc = await friendRequest.create({
    from: context.userId,
    to: toUserId,
  });

  await createNotify({
    userId: toUserId,
    type: 'friend_request',
    message: `${me.name} has sent you a friend request.`,
    relatedUserId: context.userId,
  });

  await newRequestDoc.populate('from to', 'id name email');

  return newRequestDoc;
}

async function acceptFriendRequest({ requestId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  let request = await friendRequest
    .findById(requestId)
    .populate('from', 'id name email')
    .populate('to', 'id name email');

  if (!request) {
    throw new Error('Friend request not found');
  }

  if (request.to._id.toString() !== context.userId) {
    throw new Error('Not authorized to accept this friend request');
  }

  request.status = 'accepted';
  await request.save();

  await user.findByIdAndUpdate(request.from._id, {
    $addToSet: { friends: request.to._id },
  });

  await user.findByIdAndUpdate(request.to._id, {
    $addToSet: { friends: request.from._id },
  });

  await friendRequest.findByIdAndDelete(requestId);
  await createNotify({
    userId: request.from._id,
    type: 'friend_request_accepted',
    message: `${request.to.name} has accepted your friend request.`,
    relatedUserId: request.to._id,
  });

  return request;
}

async function requestRejected({ requestId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  let request = await friendRequest.findById(requestId);
  if (!request) {
    throw new Error('Friend request not found');
  }

  if (request.to.toString() !== context.userId) {
    throw new Error('Not authorized to reject this friend request');
  }

  request.status = 'rejected';
  await request.save();
  await createNotify({
    userId: request.from,
    type: 'friend_request_rejected',
    message: `Your friend request has been rejected.`,
    relatedUserId: request.to,
  });
  return request;
}

async function unfriend({ friendId }, context) {
  try {
    if (!context.userId) {
      throw new Error('Authentication required');
    }

    await user.findByIdAndUpdate(
      context.userId,
      {
        $pull: { friends: friendId },
      },
      { new: true }
    );

    await user.findByIdAndUpdate(
      friendId,
      {
        $pull: { friends: context.userId },
      },
      { new: true }
    );

    return {
      friendId,
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error removing friend: ' + error.message);
  }
}

async function BlockUser({ blockUserId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  let currentUser = await user.findById(context.userId);
  if (!currentUser) {
    throw new Error('User not found');
  }
  let blockUser = await user.findById(blockUserId);
  if (!blockUser) {
    throw new Error('Block user not found');
  }

  if (currentUser.blockedUsers.includes(blockUserId)) {
    throw new Error('User is already blocked');
  }

  currentUser.blockedUsers.push(blockUserId);
  currentUser.friends = currentUser.friends.filter(
    friendId => friendId.toString() !== blockUserId
  );

  blockUser.friends = blockUser.friends.filter(
    friendId => friendId.toString() !== context.userId
  );
  await currentUser.populate('blockedUsers', 'id name email');
  await currentUser.save();
  await blockUser.save();
  return currentUser;
}

async function unblock({ unblockUserId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }
  let currentUser = await user.findById(context.userId);
  if (!currentUser) {
    throw new Error('User not found');
  }
  if (!currentUser.blockedUsers.includes(unblockUserId)) {
    throw new Error('User is not blocked');
  }

  currentUser.blockedUsers = currentUser.blockedUsers.filter(
    friendId => friendId.toString() !== unblockUserId
  );

  await currentUser.save();
  await currentUser.populate('blockedUsers', 'id name email');
  return currentUser;
}

//1375284967710114
//4e8da19bd322e4cee980f5746444a8ed

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  requestRejected,
  unfriend,
  BlockUser,
  unblock,
};
