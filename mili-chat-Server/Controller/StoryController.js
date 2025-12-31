const storyModel = require('../models/storyModel');
const user = require('../models/user');

async function createStory({ videoUrl, expiresAt }, context) {
  if (!context.userId) {
    throw new Error('Authentication required');
  }

  let me = await user.findById(context.userId);
  if (!me) {
    throw new Error('User not found');
  }

  let expire = new Date(expiresAt);

  let existingStory = await storyModel.findOne({ user: context.userId });

  if (!existingStory) {
    let existingStory = new storyModel({
      user: context.userId,
      stories: [{ video: videoUrl, expiresAt: expire }],
    });
  } else {
    existingStory.stories.push({ video: videoUrl, expiresAt: expire });
  }

  await existingStory.save();
  return existingStory;
}


