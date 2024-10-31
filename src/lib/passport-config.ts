import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

interface User {
  id: string;
  email: string;
  password: string;
}

const users: User[] = []; // Your user data source (can be a database)

// Serialize user into session
passport.serializeUser((user: Express.User, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((id, done) => {
  const user = users.find(user => user.id === id);
  done(null, user);
});

// Local Strategy for username and password authentication
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    const user = users.find(user => user.email === email);
    if (!user) {
      return done(null, false, { message: 'Incorrect email' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
      if (err) {
        return done(err);
      }

      if (result) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Incorrect password' });
      }
    });
  }),
);
