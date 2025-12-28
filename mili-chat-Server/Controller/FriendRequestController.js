const friendRequest = require('../models/friendRequest');
const user = require('../models/user');

async function sendFriendRequest({ toUserId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }
  if (context.userId === toUserId) {
    throw new Error('Cannot send friend request to yourself');
  }
  let me = await user.findById(context.userId);
  if (me.friends?.includes(toUserId)) {
    throw new Error('User is already your friend');
  }

  let existingRequest = await friendRequest.findOne({
    from: context.userId,
    to: toUserId,
    status: 'pending',
  });

  if (existingRequest) {
    throw new Error('Friend request already sent and pending');
  }

  const newRequestDoc = await friendRequest.create({
    from: context.userId,
    to: toUserId,
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

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  requestRejected,
  unfriend,
};
