const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { matchJobCvRaw } = require('./middleware/matchJobCv');
const { createCV } = require('./middleware/createCVJSON');
const { cvToHtml } = require('./middleware/cvToHtml');

const app = express();
const port = process.env.PORT || 8080;



mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// User model
const User = mongoose.model('User', new mongoose.Schema({
  googleId: String,
  displayName: String,
  email: String,
  jobDescription: String,
  cvText: String
}));

// Passport config
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/auth/google/callback`
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Strategy callback', { profileId: profile.id, email: profile.emails[0].value });
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value
      });
      console.log('New user created', { userId: user._id });
    } else {
      console.log('Existing user found', { userId: user._id });
    }
    return done(null, user);
  } catch (error) {
    console.error('Error in Google Strategy callback', error);
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  console.log('Serializing user', { userId: user._id });
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('Deserializing user', { userId: id });
    const user = await User.findById(id);
    if (user) {
      console.log('User found during deserialization', { userId: user._id });
    } else {
      console.log('User not found during deserialization');
    }
    done(null, user);
  } catch (error) {
    console.error('Error deserializing user', error);
    done(error, null);
  }
});

app.use(cors({
  origin: [process.env.FRONTEND_URL, `chrome-extension://${process.env.CHROME_EXTENSION_ID}`],
  credentials: true
}));
app.use(express.json());

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    sameSite: 'none',
    secure: true,
    httpOnly: true,
    // secure:false,
    secure: process.env.NODE_ENV === 'production', // set to true if your using https
    sameSite: "lax"
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login` }),
  (req, res) => {
    res.redirect(process.env.FRONTEND_URL);
  });


app.get('/api/user', (req, res) => {
  console.log('User info requested', { user: req.user ? req.user._id : 'Not authenticated' });
  console.log('Session:', req.session);
  console.log('User:', req.user);
  res.json(req.user || null);
});

app.get('/api/logout', (req, res) => {
  console.log('Logout requested', { userId: req.user ? req.user._id : 'Not authenticated',
    session: req.session,
    cookies: req.cookies
   });
  req.logout((err) => {
    if (err) {
      console.error('Error during logout', err);
      return res.status(500).json({ message: 'Error logging out' });
    }
    console.log('Logout successful');
    res.json({ message: 'Logged out successfully' });
  });
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  console.log('Unauthorized access attempt');
  res.status(401).json({ message: 'Unauthorized' });
};

// Endpoint to receive job description from extension
app.post('/api/job-description', isAuthenticated, async (req, res) => {
  const { jobDescription } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { jobDescription });
    res.json({ success: true, message: 'Job description saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving job description' });
  }
});


// New endpoint to save CV text
app.post('/api/cv-text', isAuthenticated, async (req, res) => {
  const { cvText } = req.body;
  try {
    await User.findByIdAndUpdate(req.user.id, { cvText });
    res.json({ success: true, message: 'CV text saved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving CV text' });
  }
});


app.post('/matchJobCv', isAuthenticated, async (req, res, next) => {
  if (req.query.autoMatch === 'true') {
    try {
      const user = await User.findById(req.user.id);
      if (user.jobDescription) {
        req.body.jobDescription = user.jobDescription;
      } else {
        return res.status(400).json({ message: 'No job description found' });
      }
    } catch (error) {
      return res.status(500).json({ message: 'Error retrieving job description' });
    }
  }
  next();
}, matchJobCvRaw, createCV);

app.post('/generatePdf', isAuthenticated, cvToHtml);  

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fe/dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});