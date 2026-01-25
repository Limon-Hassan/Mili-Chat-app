const conversionSchema = require('../models/conversionSchema');
const groupSchema = require('../models/groupSchema');
const user = require('../models/user');
const { createNotify } = require('./NotificationContoller');
const { getIO, getSocketIds } = require('../socket_server');

async function createGroup({ name, members = [], photo }, context) {
  try {
    if (!context.userId) {
      throw new Error('Authentication required to create a group.');
    }

    if (!/^[A-Za-z\s]+$/.test(name)) {
      throw new Error('Group name can only contain letters');
    }

    let me = await user.findById(context.userId);
    if (!me) {
      throw new Error('User not found.');
    }

    let validMembers = members.filter(memberId =>
      me.friends.includes(memberId),
    );

    const uniqueMembers = Array.from(
      new Set([...validMembers, context.userId]),
    );

    let newGroup = new groupSchema({
      name,
      members: uniqueMembers,
      photo,
      Admin: context.userId,
    });
    await newGroup.save();
    let GroupConversation = await conversionSchema.create({
      type: 'group',
      participants: uniqueMembers,
      group: newGroup._id,
      lastMessage: '',
      lastMessageAt: new Date(),
    });
    await GroupConversation.populate('participants', 'id name email avatar');
    await newGroup.populate([
      { path: 'Admin', select: 'id name email avatar' },
      { path: 'members', select: 'id name email avatar' },
    ]);

    const io = getIO();

    uniqueMembers.forEach(memberId => {
      if (memberId !== context.userId) {
        getSocketIds(memberId).forEach(sid => {
          io.to(sid).emit('addedToGroup', {
            group: newGroup,
          });
        });
      }
    });

    return newGroup;
  } catch (error) {
    console.log(error);
  }
}

async function addMembers({ groupId, members = [] }, context) {
  if (!context.userId) {
    throw new Error('Authentication required to add members to a group.');
  }
  let me = await user.findById(context.userId);
  if (!me) {
    throw new Error('User not found.');
  }
  let Group = await groupSchema.findById(groupId);
  if (!Group) {
    throw new Error('Group not found.');
  }

  if (Group.Admin.toString() !== context.userId) {
    throw new Error('Only admins can add members to the group.');
  }
  let validMembers = members.filter(memberId => me.friends.includes(memberId));

  if (!validMembers.length) {
    throw new Error('You can only add your friends');
  }

  const existingMembers = Group.members.map(id => id.toString());

  const alreadyAdded = validMembers.filter(memberId =>
    existingMembers.includes(memberId),
  );

  if (alreadyAdded.length > 0) {
    throw new Error('One or more users are already members');
  }

  let updatedMembers = Array.from(
    new Set([
      ...Group.members.map(id => id.toString()),
      ...validMembers.map(id => id.toString()),
    ]),
  );

  Group.members = updatedMembers;
  await Group.save();
  await Group.populate([
    { path: 'Admin', select: 'id name email avatar' },
    { path: 'members', select: 'id name email avatar' },
  ]);

  const io = getIO();

  validMembers.forEach(memberId => {
    const socketIds = getSocketIds(memberId);
    socketIds.forEach(sid => {
      io.to(sid).emit('addedToGroup', {
        group: Group,
      });
    });
  });
  return Group;
}

async function removeMember({ groupId, memberId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required to remove members from a group.');
  }

  let Group = await groupSchema.findById(groupId);
  if (!Group) {
    throw new Error('Group not found.');
  }

  if (Group.Admin.toString() !== context.userId) {
    throw new Error('Only admins can remove members from the group.');
  }

  if (Group.Admin.toString() === memberId) {
    throw new Error('You cannot remove the admin from the group.');
  }

  if (!Group.members.map(id => id.toString()).includes(memberId)) {
    throw new Error('User is not a group member');
  }

  Group.members = Group.members.filter(id => id.toString() !== memberId);
  await Group.save();
  await Group.populate([
    { path: 'Admin', select: 'id name email avatar' },
    { path: 'members', select: 'id name email avatar' },
  ]);

  const io = getIO();
  const socketIds = getSocketIds(memberId);

  socketIds.forEach(sid => {
    io.to(sid).emit('removedFromGroup', {
      groupId,
    });
  });
  return Group;
}

async function leaveGroup({ groupId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required to leave a group.');
  }

  let Group = await groupSchema.findById(groupId);
  if (!Group) {
    throw new Error('Group not found.');
  }

  if (!Group.members.map(id => id.toString()).includes(context.userId)) {
    throw new Error('You are not a member of this group');
  }

  if (Group.Admin.toString() === context.userId) {
    throw new Error('Admin cannot leave the group.');
  }

  Group.members = Group.members.filter(id => id.toString() !== context.userId);
  await Group.save();
  await Group.populate([
    { path: 'Admin', select: 'id name email avatar' },
    { path: 'members', select: 'id name email avatar' },
  ]);

  const io = getIO();

  Group.members.forEach(memberId => {
    getSocketIds(memberId.toString()).forEach(sid => {
      io.to(sid).emit('memberLeftGroup', {
        groupId,
        userId: context.userId,
      });
    });
  });
  return Group;
}

async function deleteGroup({ groupId }, context) {
  if (!context.userId) {
    throw new Error('Authentication required to delete a group.');
  }
  let Group = await groupSchema.findById(groupId);
  if (!Group) {
    throw new Error('Group not found.');
  }
  if (Group.Admin.toString() !== context.userId) {
    throw new Error('Only admins can delete the group.');
  }

  await groupSchema.findByIdAndDelete(groupId);
  const io = getIO();

  const members = Group.members.map(id => id.toString());

  members.forEach(memberId => {
    if (memberId !== context.userId) {
      getSocketIds(memberId).forEach(sid => {
        io.to(sid).emit('groupDeleted', { groupId });
      });
    }
  });
  return true;
}

async function requestToJoinGroup({ groupId }, context) {
  if (!context.userId) throw new Error('Authentication required');

  let me = await user.findById(context.userId);
  if (!me) throw new Error('User not found');
  let group = await groupSchema.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.members.map(id => id.toString()).includes(context.userId))
    throw new Error('You are already a member');

  if (group.pendingRequests.includes(context.userId))
    throw new Error('You already requested to join');

  group.pendingRequests.push(context.userId);
  await group.save();
  await createNotify({
    userId: group.Admin,
    type: 'join_request',
    message: `${me.name} wants to join your group`,
    relatedUserId: context.userId,
  });
  await group.populate([
    { path: 'Admin', select: 'id name email avatar' },
    { path: 'members', select: 'id name email avatar' },
  ]);

  const io = getIO();
  getSocketIds(group.Admin.toString()).forEach(sid => {
    io.to(sid).emit('groupJoinRequest', {
      groupId,
      message: `${me.name} wants to join your group`,
      user: me,
    });
  });
  return group;
}

async function handleJoinRequest({ groupId, userId, action }, context) {
  if (!context.userId) throw new Error('Authentication required');

  let group = await groupSchema.findById(groupId);
  if (!group) throw new Error('Group not found');

  if (group.Admin.toString() !== context.userId)
    throw new Error('Only admin can handle join requests');

  if (!group.pendingRequests.includes(userId))
    throw new Error('No pending request from this user');

  if (action === 'accept') {
    group.members.push(userId);
  }
  group.pendingRequests = group.pendingRequests.filter(
    id => id.toString() !== userId,
  );

  await group.save();
  await group.populate([
    { path: 'Admin', select: 'id name email avatar' },
    { path: 'members', select: 'id name email avatar' },
  ]);
  if (action === 'accept') {
    const io = getIO();
    getSocketIds(userId).forEach(sid => {
      io.to(sid).emit('joinRequestAccepted', {
        group,
      });
    });
  }

  return group;
}

module.exports = {
  createGroup,
  addMembers,
  removeMember,
  leaveGroup,
  deleteGroup,
  requestToJoinGroup,
  handleJoinRequest,
};
