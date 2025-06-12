// const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const User = require('../models/User');

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: 'http://localhost:5000/api/auth/google/callback'
// }, async (accessToken, refreshToken, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });
//     if (!user) {
//       const username = profile.emails[0].value.split('@')[0] + Math.random().toString(36).substring(7);
//       user = await User.create({
//         googleId: profile.id,
//         username,
//         email: profile.emails[0].value
//       });
//     }
//     done(null, user);
//   } catch (err) {
//     console.error('Google OAuth error:', err);
//     done(err, null);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     console.error('Deserialize user error:', err);
//     done(err, null);
//   }
// });
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  console.log('Google OAuth callback - Profile:', JSON.stringify(profile, null, 2));
  console.log('Google OAuth callback - Access Token:', accessToken);
  try {
    if (!profile.emails || !profile.emails.length) {
      console.error('Google OAuth error: No email found in profile');
      return done(new Error('No email provided by Google profile'), null);
    }
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      const username = profile.emails[0].value.split('@')[0] + Math.random().toString(36).substring(7);
      console.log('Creating new user:', { googleId: profile.id, username, email: profile.emails[0].value });
      user = await User.create({
        googleId: profile.id,
        username,
        email: profile.emails[0].value
      });
    } else {
      console.log('User found:', user);
    }
    done(null, user);
  } catch (err) {
    console.error('Google OAuth error:', err.message, err.stack);
    done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    console.error('Deserialize user error:', err);
    done(err, null);
  }
});