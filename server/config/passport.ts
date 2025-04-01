import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';
import type { Profile as GoogleProfile } from 'passport-google-oauth20';
import type { Profile as FacebookProfile } from 'passport-facebook';
import type { Profile as GitHubProfile } from 'passport-github2';
import type { IUser } from '../models/User.js';

passport.serializeUser((user: Express.User, done: (err: any, id?: unknown) => void) => {
  done(null, (user as IUser).id);
});

passport.deserializeUser(async (id: string, done: (err: any, user?: Express.User | false | null) => void) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackURL: '/api/auth/google/callback',
}, async (accessToken: string, refreshToken: string, profile: GoogleProfile, done: (error: any, user?: IUser | false) => void) => {
  try {
    let user = await User.findOne({ socialId: profile.id, provider: 'google' });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0].value,
        socialId: profile.id,
        provider: 'google',
        avatar: profile.photos?.[0].value,
      });
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

// Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID || '',
  clientSecret: process.env.FACEBOOK_APP_SECRET || '',
  callbackURL: '/api/auth/facebook/callback',
  profileFields: ['id', 'displayName', 'photos', 'email'],
}, async (accessToken: string, refreshToken: string, profile: FacebookProfile, done: (error: any, user?: IUser | false) => void) => {
  try {
    let user = await User.findOne({ socialId: profile.id, provider: 'facebook' });

    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0].value,
        socialId: profile.id,
        provider: 'facebook',
        avatar: profile.photos?.[0].value,
      });
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

// GitHub Strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || '',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  callbackURL: '/api/auth/github/callback',
}, async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: (error: any, user?: IUser | false) => void) => {
  try {
    let user = await User.findOne({ socialId: profile.id, provider: 'github' });

    if (!user) {
      user = await User.create({
        name: profile.displayName || profile.username,
        email: profile.emails?.[0].value,
        socialId: profile.id,
        provider: 'github',
        avatar: profile.photos?.[0].value,
      });
    }

    done(null, user);
  } catch (error) {
    done(error, false);
  }
}));

export default passport;