import mongoose, { Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  songs: mongoose.Types.ObjectId[];
  coverImage?: string;
  isPublic: boolean;
  collaborative: boolean;
  collaborators: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  folder?: string;
  tags: string[];
}

const playlistSchema = new Schema<IPlaylist>({
  name: {
    type: String,
    required: [true, 'Playlist name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  songs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300'
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  collaborative: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  folder: {
    type: String,
    default: ''
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

export default mongoose.model<IPlaylist>('Playlist', playlistSchema);
