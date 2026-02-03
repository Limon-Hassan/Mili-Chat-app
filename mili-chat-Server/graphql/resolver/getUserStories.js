const user = require('../../models/user');
const Story = require('../../models/storyModel');

async function getUserStories(_, { userId }, context) {
  if (!context.userId) throw new Error('Unauthorized');
  const tergetUser = await user.findById(userId).lean();
  if (!tergetUser) throw new Error('User not found');

  const friend = context.userId ? isFriend(tergetUser, context.userId) : false;

  if (tergetUser.storyPrivacy === 'onlyMe') {
    return [];
  }

  if (
    tergetUser.storyPrivacy === 'public' ||
    (tergetUser.storyPrivacy === 'friends' && friend)
  ) {
    const stories = await Story.find({ user: userId })
      .populate('user', 'name avatar')
      .populate('stories', 'video createdAt')
      .lean();

    return stories.map(story => ({
      id: story._id.toString(),
      user: {
        id: story.user._id.toString(),
        name: story.user.name,
        avatar: story.user.avatar,
      },
      stories: story.stories.map(s => ({
        id: s._id.toString(),
        video: s.video,
        createdAt: s.createdAt,
      })),
    }));
  }
}

function isFriend(user, viewerId) {
  return user.friends.some(id => id.toString() === viewerId.toString());
}

module.exports = getUserStories;
