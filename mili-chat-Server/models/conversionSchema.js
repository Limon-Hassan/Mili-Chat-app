const { default: mongoose } = require('mongoose');

let conversionSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  lastMessage: {
    type: String,
  },

  lastMessageType: {
    type: String,
    enum: ['text', 'image', 'video', 'audio', 'link'],
  },

  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Conversation', conversionSchema);
