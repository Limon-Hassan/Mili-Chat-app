const storyModel = require('../models/storyModel');
const user = require('../models/user');
const { createNotify } = require('./NotificationContoller');
const { getIO, getSocketIds } = require('../socket_server');

async function createStory({ videoUrl }, context) {
  if (!context.userId) throw new Error('Authentication required');

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  let storyDoc = await storyModel.findOne({ user: context.userId });

  if (!storyDoc) {
    storyDoc = await storyModel.create({
      user: context.userId,
      stories: [{ video: videoUrl, expiresAt, status: 'active' }],
    });
  } else {
    storyDoc.stories.push({ video: videoUrl, expiresAt, status: 'active' });
    await storyDoc.save();
  }

  await storyDoc.populate('user', 'name id avatar storyPrivacy');

  const me = await user.findById(context.userId).populate('friends', '_id');

  const io = getIO();

  for (let friend of me.friends) {
    await createNotify({
      userId: friend._id,
      type: 'new_story',
      message: `${me.name} added a new story`,
      relatedUserId: context.userId,
    });

    getSocketIds(friend._id.toString()).forEach(sid => {
      io.to(sid).emit('newStory', {
        userId: context.userId,
        userName: me.name,
        avatar: me.avatar,
      });
    });
  }
  return storyDoc;
}

async function getNewStories(context) {
  if (!context.userId) throw new Error('Authentication required');

  const me = await user.findById(context.userId).populate('friends', '_id');
  const now = new Date();

  const stories = await storyModel
    .find({ 'stories.status': 'active' })
    .populate('user', 'name avatar storyPrivacy')
    .lean();

  return stories
    .map(story => {
      const visibleStories = story.stories.filter(s => {
        if (s.status !== 'active') return false;
        if (s.expiresAt < now) return false;

        if (story.user._id.toString() === context.userId) return true;
        if (story.user.storyPrivacy === 'public') return true;
        if (story.user.storyPrivacy === 'friends') {
          return me.friends.some(
            f => f._id.toString() === story.user._id.toString(),
          );
        }
        return false;
      });

      return { ...story, stories: visibleStories };
    })
    .filter(s => s.stories.length > 0);
}

async function getAllStories(context) {
  if (!context.userId) throw new Error('Authentication required');

  const me = await user.findById(context.userId).populate('friends', '_id');
  if (!me) throw new Error('User not found');


  const allStories = await storyModel
    .find({ 'stories.status': 'expired' })
    .populate('user', 'name avatar storyPrivacy')
    .lean();

  const visibleStories = allStories.map(story => {
    const privacy = story.user.storyPrivacy;

    const filteredStories = story.stories.filter(s => {
      if (s.status !== 'expired') return false;

      if (story.user._id.toString() === context.userId) return true;

      if (privacy === 'public') return true;

      if (privacy === 'friends') {
        return me.friends.some(
          f => f._id.toString() === story.user._id.toString(),
        );
      }

      return false;
    });

    return {
      ...story,
      stories: filteredStories,
    };
  });

  return visibleStories.filter(s => s.stories.length > 0);
}

async function markAsSeen({ storyId, storyItemId }, context) {
  if (!context.userId) throw new Error('Authentication required');

  let story = await storyModel
    .findById(storyId)
    .populate('user', 'id name avatar')
    .populate('stories.seenBy.user', 'id name avatar');

  if (!story) throw new Error('Story not found');

  let storyItem = story.stories.id(storyItemId);
  if (!storyItem) throw new Error('Story item not found');

  const alreadySeen = storyItem.seenBy.some(
    s => s.user._id.toString() === context.userId,
  );

  if (!alreadySeen) {
    storyItem.seenBy.push({
      user: context.userId,
      seenAt: new Date(),
    });

    await story.save();
  }

  await story.populate('stories.seenBy.user', 'id name avatar');
  const io = getIO();
  const ownerId = story.user._id.toString();

  getSocketIds(ownerId).forEach(sid => {
    io.to(sid).emit('storySeen', {
      storyId,
      storyItemId,
      seenBy: {
        userId: context.userId,
        seenAt: new Date(),
      },
    });
  });

  return story;
}

async function storyReaction({ storyId, storyItemId, reaction }, context) {
  if (!context.userId) throw new Error('Authentication required');
  let story = await storyModel.findById(storyId);
  if (!story) {
    throw new Error('Story not found');
  }
  let now = new Date();
  let storyItem = story.stories.id(storyItemId);
  if (!storyItem) {
    throw new Error('Story item not found');
  }
  if (storyItem.expiresAt < now) throw new Error('Story has expired');

  if (story.user.toString() === context.userId) {
    throw new Error('You cannot react to your own story');
  }
  const existingReaction = storyItem.reactions.find(
    r => r.user.toString() === context.userId,
  );
  if (existingReaction) {
    existingReaction.type = reaction;
    existingReaction.reactedAt = now;
  } else {
    storyItem.reactions.push({
      user: context.userId,
      type: reaction,
      reactedAt: now,
    });
  }

  await story.save();
  await story.populate('stories.reactions.user', 'id name avatar');
  let io = getIO();

  getSocketIds(story.user._id.toString()).forEach(sid => {
    io.to(sid).emit('storyReaction', {
      storyId,
      storyItemId,
      reaction,
      userId: context.userId,
    });
  });
  return true;
}

// async function expireStory() {
//   let now = new Date();
//   let story = await storyModel.find({ 'stories.expiresAt': { $lt: now } });

//   for (let storyDoc of story) {
//     for (let storyItem of storyDoc.stories) {
//       if (storyItem.expiresAt <= now && !storyItem.expiredNotified) {
//         let totalSeen = storyItem.seenBy.length;
//         const reactionsCount = storyItem.reactions.reduce((acc, r) => {
//           acc[r.type] = (acc[r.type] || 0) + 1;
//           return acc;
//         }, {});

//         let topReaction = null;
//         let maxCount = 0;
//         for (let type in reactionsCount) {
//           if (reactionsCount[type] > maxCount) {
//             maxCount = reactionsCount[type];
//             topReaction = type;
//           }
//         }

//         let message = `Your story expired. Seen by ${totalSeen} people.`;
//         if (topReaction) {
//           message += ` Top reaction: ${topReaction} (${maxCount})`;
//         }

//         await createNotify({
//           userId: storyDoc.user,
//           type: 'story_expired',
//           message,
//           relatedUserId: null,
//         });
//         storyItem.expiredNotified = true;

//         let io = getIO();
//         getSocketIds(storyDoc.user.toString()).forEach(sid => {
//           io.to(sid).emit('storyExpired', {
//             storyId: storyDoc._id.toString(),
//             storyItemId: storyItem._id.toString(),
//             totalSeen,
//             topReaction,
//             maxCount,
//           });
//         });
//       }
//     }

//     await storyDoc.save();
//   }
// }

async function expireStory() {
  const now = new Date();

  const stories = await storyModel.find({ 'stories.expiresAt': { $lt: now } });

  for (let storyDoc of stories) {
    let updated = false;

    for (let storyItem of storyDoc.stories) {
      if (storyItem.status === 'active' && storyItem.expiresAt <= now) {
        storyItem.status = 'expired';

        updated = true;

        if (storyItem.expiredNotified === false) {
          const totalSeen = storyItem.seenBy.length;

          const reactionsCount = storyItem.reactions.reduce((acc, r) => {
            acc[r.type] = (acc[r.type] || 0) + 1;
            return acc;
          }, {});

          let topReaction = null;
          let maxCount = 0;
          for (let type in reactionsCount) {
            if (reactionsCount[type] > maxCount) {
              maxCount = reactionsCount[type];
              topReaction = type;
            }
          }

          let message = `Your story expired. Seen by ${totalSeen} people.`;
          if (topReaction) {
            message += ` Top reaction: ${topReaction} (${maxCount})`;
          }

          await createNotify({
            userId: storyDoc.user,
            type: 'story_expired',
            message,
            relatedUserId: null,
          });

          storyItem.expiredNotified = true;

          const io = getIO();
          getSocketIds(storyDoc.user.toString()).forEach(sid => {
            io.to(sid).emit('storyExpired', {
              storyId: storyDoc._id.toString(),
              storyItemId: storyItem._id.toString(),
              totalSeen,
              topReaction,
              maxCount,
            });
          });
        }
      }
    }

    if (updated) {
      await storyDoc.save();
    }
  }
}

module.exports = {
  createStory,
  getNewStories,
  getAllStories,
  markAsSeen,
  storyReaction,
  expireStory,
};
