import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null
    },
    message: {
      type: String,
      required: [true, 'Message content cannot be empty'],
      trim: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    readStatus: {
      type: Boolean,
      default: false
    },
    is_read: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

chatSchema.index({ sender: 1, receiver: 1, createdAt: 1 });

const Chat = mongoose.models.Chat || mongoose.model('Chat', chatSchema);
export default Chat;
