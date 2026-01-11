let mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: function () {
      return this.provider === 'local';
    },
    unique: true,
    trim: true,
    set: v => (typeof v === 'string' ? v.replace(/\s+/g, '') : v),
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: function () {
      return this.provider === 'local';
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
  },

  bio: {
    type: String,
    maxLength: 150,
    default: '',
  },

  voiceIntro: {
    url: String,
    duration: Number,
  },

  googleId: String,
  facebookId: String,
  provider: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    default: 'local',
  },
  friendListPrivacy: {
    type: String,
    enum: ['public', 'friends', 'onlyMe'],
    default: 'friends',
  },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  storyPrivacy: {
    type: String,
    enum: ['public', 'friends', 'onlyme'],
    default: 'public',
  },
});

module.exports = mongoose.model('User', userSchema);
