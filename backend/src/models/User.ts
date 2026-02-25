import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  username?: string;
  profileImage?: string;
  bio?: string;
  oauth?: {
    google?: {
      id: string;
      email: string;
    };
    facebook?: {
      id: string;
      email: string;
    };
    twitter?: {
      id: string;
      email: string;
    };
    github?: {
      id: string;
      email: string;
    };
  };
  role: 'user' | 'admin';
  subscription: {
    plan: 'free' | 'premium';
    startDate?: Date;
    endDate?: Date;
    stripeCustomerId?: string;
  };
  likedSongs: mongoose.Types.ObjectId[];
  playlists: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  followingArtists: mongoose.Types.ObjectId[];
  recentlyPlayed: Array<{
    song: mongoose.Types.ObjectId;
    playedAt: Date;
  }>;
  preferences: {
    favoriteGenres: string[];
    theme: 'dark' | 'light';
    language: string;
    explicitContent: boolean;
  };
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  otp?: string;
  otpExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  username: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  profileImage: {
    type: String,
    default: 'https://via.placeholder.com/150'
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  oauth: {
    google: {
      id: String,
      email: String
    },
    facebook: {
      id: String,
      email: String
    },
    twitter: {
      id: String,
      email: String
    },
    github: {
      id: String,
      email: String
    }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String
  },
  likedSongs: [{
    type: Schema.Types.ObjectId,
    ref: 'Song'
  }],
  playlists: [{
    type: Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  followingArtists: [{
    type: Schema.Types.ObjectId,
    ref: 'Artist'
  }],
  recentlyPlayed: [{
    song: {
      type: Schema.Types.ObjectId,
      ref: 'Song'
    },
    playedAt: {
      type: Date,
      default: Date.now
    }
  }],
  preferences: {
    favoriteGenres: [String],
    theme: {
      type: String,
      enum: ['dark', 'light'],
      default: 'dark'
    },
    language: {
      type: String,
      default: 'en'
    },
    explicitContent: {
      type: Boolean,
      default: true
    }
  },
  emailVerified: {
    type: Boolean,
    default: false
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  lastLogin: Date,
  otp: {
    type: String,
    select: false
  },
  otpExpiry: {
    type: Date,
    select: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
