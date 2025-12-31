const mongoose = require('mongoose');

const storySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    privacy: {
      type: String,
      enum: ['public', 'friends', 'onlyme'],
      default: 'public',
    },
    stories: [
      {
        video: { type: String, required: true },
        expiresAt: {
          type: Date,
          required: true,
        },
        seenBy: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            seenAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        reactions: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
            },
            type: {
              type: String, 
              required: true,
            },
            reactedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);


module.exports = mongoose.model('Story', storySchema);
