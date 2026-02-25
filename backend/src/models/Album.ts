import mongoose, { Document, Schema } from 'mongoose';

export interface IAlbum extends Document {
  title: string;
  artist: string;
  coverImage: string;
  releaseYear: number;
  genre: string;
  songs: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const albumSchema = new Schema<IAlbum>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    artist: {
      type: String,
      required: true,
      trim: true
    },
    coverImage: {
      type: String,
      required: true
    },
    releaseYear: {
      type: Number,
      required: true
    },
    genre: {
      type: String,
      required: true,
      trim: true
    },
    songs: [{
      type: Schema.Types.ObjectId,
      ref: 'Song'
    }]
  },
  {
    timestamps: true
  }
);

albumSchema.index({ title: 'text', artist: 'text' });
albumSchema.index({ genre: 1 });
albumSchema.index({ releaseYear: -1 });

export default mongoose.model<IAlbum>('Album', albumSchema);
