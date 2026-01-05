const storyModel = require('../models/storyModel');
const user = require('../models/user');
const { createNotify } = require('./NotificationContoller');

async function createStory({ videoUrl }, context) {
  if (!context.userId) throw new Error('Authentication required');

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  let storyDoc = await storyModel.findOne({ user: context.userId });

  if (!storyDoc) {
    storyDoc = await storyModel.create({
      user: context.userId,
      stories: [{ video: videoUrl, expiresAt }],
    });
  } else {
    storyDoc.stories.push({ video: videoUrl, expiresAt });
    await storyDoc.save();
  }
  await storyDoc.populate('user', 'name id avatar storyPrivacy');
  return storyDoc;
}

async function getStories(context) {
  if (!context.userId) throw new Error('Authentication required');

  const me = await user.findById(context.userId).populate('friends', '_id');

  if (!me) throw new Error('User not found');

  const allStories = await storyModel
    .find({})
    .populate('user', 'name storyPrivacy id avatar reactions stories.seenBy')
    .lean();

  const now = new Date();

  const visibleStories = allStories.map(story => {
    const privacy = story.user.storyPrivacy;

    const stories = story.stories.filter(s => {
      if (s.expiresAt < now) return false;

      if (story.user._id.toString() === context.userId) return true;
      if (privacy === 'public') return true;
      if (privacy === 'friends') {
        return me.friends.some(
          f => f._id.toString() === story.user._id.toString()
        );
      }
      return false;
    });

    return { ...story, stories };
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
    s => s.user._id.toString() === context.userId
  );

  if (!alreadySeen) {
    storyItem.seenBy.push({
      user: context.userId,
      seenAt: new Date(),
    });

    await story.save();
  }

  await story.populate('stories.seenBy.user', 'id name avatar');

  return story;
}

async function storyReaction({ storyId, storyItemId, reaction }, context) {
  if (!context.userId) throw new Error('Authentication required');
  let story = await storyId.findById(storyId);
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
    r => r.user.toString() === context.userId
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
  return true;
}

async function expireStory() {
  let now = new Date();
  let story = await storyModel.find({ 'stories.expiresAt': { $lt: now } });

  for (let storyDoc of story) {
    for (let storyItem of storyDoc.stories) {
      if (storyItem.expiresAt <= now && !storyItem.expiredNotified) {
        let totalSeen = storyItem.seenBy.length;
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
      }
    }

    await storyDoc.save();
  }
}

module.exports = {
  createStory,
  getStories,
  markAsSeen,
  storyReaction,
  expireStory,
};
