import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await User.findOne({ 'oauth.google.id': profile.id });

        if (user) {
          // User exists, return user
          return done(null, user);
        }

        // Check if user exists with same email
        const email = profile.emails?.[0]?.value;
        if (email) {
          user = await User.findOne({ email });
          
          if (user) {
            // Link Google account to existing user
            if (!user.oauth) {
              user.oauth = {} as any;
            }
            user.oauth.google = {
              id: profile.id,
              email: email
            };
            user.emailVerified = true; // Google emails are verified
            await user.save();
            return done(null, user);
          }
        }

        // Create new user
        const newUser = await User.create({
          email: email || `${profile.id}@google.com`,
          name: profile.displayName || 'Google User',
          password: `OAUTH_${Math.random().toString(36).slice(-16)}${Math.random().toString(36).slice(-16)}`, // Random secure password
          profileImage: profile.photos?.[0]?.value || 'https://via.placeholder.com/150',
          oauth: {
            google: {
              id: profile.id,
              email: email || ''
            }
          },
          emailVerified: true, // Google emails are verified
          role: 'user'
        });

        done(null, newUser);
      } catch (error) {
        done(error as Error, undefined);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
