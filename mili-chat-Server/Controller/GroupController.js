const groupSchema = require('../models/groupSchema');
const user = require('../models/user');
const { createNotify } = require('./NotificationContoller');

async function createGroup({ name, members = [], photo }, context) {
  if (!context.userId) {
    throw new Error('Authentication required to create a group.');
  }
  let me = await user.findById(context.userId);
  if (!me) {
    throw new Error('User not found.');
  }

  let validMembers = members.filter(memberId => me.friends.includes(memberId));

  const uniqueMembers = Array.from(new Set([...validMembers, context.userId]));

  let newGroup = new groupSchema({
    name,
    members: uniqueMembers,
    photo,
    Admin: context.userId,
  });
  await newGroup.save();
  return newGroup;
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

  let updatedMembers = Array.from(
    new Set([
      ...Group.members.map(id => id.toString()),
      ...validMembers.map(id => id.toString()),
    ])
  );

  Group.members = updatedMembers;
  await Group.save();
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
    id => id.toString() !== userId
  );

  await group.save();
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
