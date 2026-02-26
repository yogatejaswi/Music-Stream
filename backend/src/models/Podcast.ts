import mongoose, { Document, Schema } from 'mongoose';

export interface IPodcast extends Document {
  title: string;
  description: string;
  host: string;
  category: string;
  coverImage: string;
  language: string;
  isExplicit: boolean;
  totalEpisodes: number;
  subscribers: number;
  rating: number;
  ratingCount: number;
  tags: string[];
  website?: string;
  rssUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const podcastSchema = new Schema<IPodcast>({
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
  host: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Technology',
      'Business',
      'Education',
      'Comedy',
      'News',
      'Health',
      'Science',
      'Sports',
      'Music',
      'Arts',
      'History',
      'True Crime',
      'Fiction',
      'Self-Help',
      'Religion',
      'Politics',
      'Entertainment',
      'Gaming',
      'Food',
      'Travel'
    ]
  },
  coverImage: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'en'
  },
  isExplicit: {
    type: Boolean,
    default: false
  },
  totalEpisodes: {
    type: Number,
    default: 0
  },
  subscribers: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  ratingCount: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  website: {
    type: String,
    trim: true
  },
  rssUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes
podcastSchema.index({ title: 'text', description: 'text', host: 'text' });
podcastSchema.index({ category: 1 });
podcastSchema.index({ rating: -1 });
podcastSchema.index({ subscribers: -1 });
podcastSchema.index({ createdAt: -1 });

export default mongoose.model<IPodcast>('Podcast', podcastSchema);