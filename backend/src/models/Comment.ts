import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  song: mongoose.Types.ObjectId;
  text: string;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
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
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    likes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  {
    timestamps: true
  }
);

commentSchema.index({ song: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

export default mongoose.model<IComment>('Comment', commentSchema);
