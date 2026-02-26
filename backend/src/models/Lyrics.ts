import mongoose, { Document, Schema } from 'mongoose';

export interface ILyrics extends Document {
  songId: mongoose.Types.ObjectId;
  lyrics: string;
  syncedLyrics?: Array<{
    time: number; // in seconds
    text: string;
  }>;
  language: string;
  source: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lyricsSchema = new Schema<ILyrics>({
  songId: {
    type: Schema.Types.ObjectId,
    ref: 'Song',
    required: true,
    unique: true
  },
  lyrics: {
    type: String,
    required: true
  },
  syncedLyrics: [{
    time: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }],
  language: {
    type: String,
    default: 'en'
  },
  source: {
    type: String,
    default: 'manual'
  },
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for faster queries
lyricsSchema.index({ songId: 1 });
lyricsSchema.index({ language: 1 });

export default mongoose.model<ILyrics>('Lyrics', lyricsSchema);