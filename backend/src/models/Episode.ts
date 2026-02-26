import mongoose, { Document, Schema } from 'mongoose';

export interface IEpisode extends Document {
  podcastId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  audioUrl: string;
  duration: number; // in seconds
  episodeNumber: number;
  season?: number;
  publishDate: Date;
  isExplicit: boolean;
  transcript?: string;
  chapters?: Array<{
    title: string;
    startTime: number;
    endTime?: number;
  }>;
  tags: string[];
  playCount: number;
  likes: number;
  downloads: number;
  createdAt: Date;
  updatedAt: Date;
}

const episodeSchema = new Schema<IEpisode>({
  podcastId: {
    type: Schema.Types.ObjectId,
    ref: 'Podcast',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  audioUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true,
    min: 0
  },
  episodeNumber: {
    type: Number,
    required: true,
    min: 1
  },
  season: {
    type: Number,
    min: 1
  },
  publishDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  isExplicit: {
    type: Boolean,
    default: false
  },
  transcript: {
    type: String
  },
  chapters: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    startTime: {
      type: Number,
      required: true,
      min: 0
    },
    endTime: {
      type: Number,
      min: 0
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  playCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes
episodeSchema.index({ podcastId: 1, episodeNumber: 1 }, { unique: true });
episodeSchema.index({ title: 'text', description: 'text' });
episodeSchema.index({ publishDate: -1 });
episodeSchema.index({ playCount: -1 });
episodeSchema.index({ likes: -1 });

export default mongoose.model<IEpisode>('Episode', episodeSchema);