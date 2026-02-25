import mongoose, { Document, Schema } from 'mongoose';

export interface ISong extends Document {
  title: string;
  artist: string;
  artistRef?: mongoose.Types.ObjectId;
  album?: mongoose.Types.ObjectId;
  duration: number;
  audioUrl: string;
  coverImage?: string;
  genre: string[];
  mood?: string;
  releaseDate?: Date;
  releaseYear?: number;
  playCount: number;
  likes: number;
  isPremium: boolean;
  uploadedBy: mongoose.Types.ObjectId;
  lyrics?: string;
  language?: string;
  explicit: boolean;
}

const songSchema = new Schema<ISong>({
  title: {
    type: String,
    required: [true, 'Song title is required'],
    trim: true,
    index: true
  },
  artist: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
    index: true
  },
  artistRef: {
    type: Schema.Types.ObjectId,
    ref: 'Artist'
  },
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album'
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required']
  },
  audioUrl: {
    type: String,
    required: [true, 'Audio URL is required']
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  genre: [{
    type: String,
    trim: true,
    index: true
  }],
  mood: {
    type: String,
    enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'party', 'workout', 'chill', ''],
    default: ''
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  releaseYear: {
    type: Number
  },
  playCount: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lyrics: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'English'
  },
  explicit: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for search optimization
songSchema.index({ title: 'text', artist: 'text' });
songSchema.index({ playCount: -1 });
songSchema.index({ createdAt: -1 });

export default mongoose.model<ISong>('Song', songSchema);
