const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const path = require('path');
const { matchJobCvRaw } = require('./middleware/matchJobCv');
const { createCV } = require('./middleware/createCVJSON');
const { cvToHtml } = require('./middleware/cvToHtml');

const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection
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
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value
      });
    }
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

app.use(cors({
  origin: [`chrome-extension://${process.env.CHROME_EXTENSION_ID}`, process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

// Serve static files from the Vite build output (dist folder)
app.use(express.static(path.join(__dirname, '../fe/dist')));

// Auth routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });


app.get('/api/user', (req, res) => {
  res.json(req.user || null);
});

app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error logging out' });
    }
    res.json({ message: 'Logged out successfully' });
  });
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized' });
};

// Updated Google authentication for extension
app.post('/api/auth/google', async (req, res) => {
  const { email, name, picture } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (!user) {
      user = await User.create({
        email: email,
        displayName: name,
        googleId: email // Using email as googleId for simplicity
      });
    }
    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Error logging in' });
      }
      return res.json({ success: true, user });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error during authentication' });
  }
});

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

// Endpoint to get job description
app.get('/api/job-description', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, jobDescription: user.jobDescription });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving job description' });
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

// New endpoint to get CV text
app.get('/api/cv-text', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, cvText: user.cvText });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving CV text' });
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fe/dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});