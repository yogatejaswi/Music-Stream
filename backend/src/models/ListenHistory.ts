import mongoose, { Document, Schema } from 'mongoose';

export interface IListenHistory extends Document {
  user: mongoose.Types.ObjectId;
  song: mongoose.Types.ObjectId;
  playedAt: Date;
  duration: number;
  completed: boolean;
}

const listenHistorySchema = new Schema<IListenHistory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    song: {
      type: Schema.Types.ObjectId,
      ref: 'Song',
      required: true
    },
    playedAt: {
      type: Date,
      default: Date.now
    },
    duration: {
      type: Number,
      default: 0
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: false
  }
);

listenHistorySchema.index({ user: 1, playedAt: -1 });
listenHistorySchema.index({ song: 1 });

export default mongoose.model<IListenHistory>('ListenHistory', listenHistorySchema);
