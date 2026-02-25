import mongoose, { Document, Schema } from 'mongoose';

export interface IArtist extends Document {
  name: string;
  bio: string;
  profileImage: string;
  coverImage: string;
  genre: string[];
  followers: mongoose.Types.ObjectId[];
  verified: boolean;
  socialLinks: {
    website?: string;
    twitter?: string;
    instagram?: string;
    facebook?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const artistSchema = new Schema<IArtist>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    bio: {
      type: String,
      default: ''
    },
    profileImage: {
      type: String,
      default: 'https://via.placeholder.com/300'
    },
    coverImage: {
      type: String,
      default: 'https://via.placeholder.com/1200x400'
    },
    genre: [{
      type: String,
      trim: true
    }],
    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],
    verified: {
      type: Boolean,
      default: false
    },
    socialLinks: {
      website: String,
      twitter: String,
      instagram: String,
      facebook: String
    }
  },
  {
    timestamps: true
  }
);

artistSchema.index({ name: 'text' });

export default mongoose.model<IArtist>('Artist', artistSchema);
