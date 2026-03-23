const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const bcrypt = require('bcrypt');
const db = require('../db/index');

// Local Strategy
passport.use(new LocalStrategy(
  { usernameField: 'username' },
  async (username, password, done) => {
    try {
      const result = await db.query(
        'SELECT * FROM users WHERE username = $1',
        [username]
      );

      if (result.rows.length === 0) {
        return done(null, false, { message: 'User not found' });
      }

      const user = result.rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Google Strategy
passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SESSION_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists with this Google ID
      const existing = await db.query(
        'SELECT * FROM users WHERE google_id = $1',
        [profile.id]
      );

      if (existing.rows.length > 0) {
        return done(null, existing.rows[0]);
      }

      // Check if email already exists
      const emailCheck = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [profile.emails[0].value]
      );

      if (emailCheck.rows.length > 0) {
        // Link Google ID to existing account
        const updated = await db.query(
          'UPDATE users SET google_id = $1 WHERE email = $2 RETURNING *',
          [profile.id, profile.emails[0].value]
        );
        return done(null, updated.rows[0]);
      }

      // Create new user
      const newUser = await db.query(
        'INSERT INTO users (username, email, google_id, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
        [profile.displayName, profile.emails[0].value, profile.id, 'google_oauth']
      );

      return done(null, newUser.rows[0]);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
}); //Stores user id in session cookie instead of entire user object

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (err) {
    done(err);
  }
}); //On every subsequent request uses the stored id from the session, queries database for full user and attaches it to req.user

module.exports = passport;