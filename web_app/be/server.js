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
const { autoMatchMiddleware } = require('./middleware/autoMatchMiddleware');
const { getTemplates } = require('./controllers/templateController');
const User = require('./models/User');
const cvToHtmlPreview = require('./controllers/cvToHtmlPreview');

const app = express();
const port = process.env.PORT || 8080;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

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
  if (req.user) {
    const { id, displayName, email, selectedTemplate } = req.user;
    res.json({ id, displayName, email, selectedTemplate });
  } else {
    res.json(null);
  }
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

// Modified endpoint to receive job description from frontend
app.post('/api/job-description', async (req, res) => {
  const { jobDescription } = req.body;
  try {
    let user;
    if (req.user) {
      user = await User.findByIdAndUpdate(req.user.id, { jobDescription }, { new: true });
    } else {
      user = await User.findOneAndUpdate({}, { jobDescription }, { new: true, upsert: true });
    }
    res.json({ success: true, message: 'Job description saved successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving job description' });
  }
});

// Modified endpoint to get job description
app.get('/api/job-description', async (req, res) => {
  try {
    let user;
    if (req.user) {
      user = await User.findById(req.user.id);
    } else {
      user = await User.findOne();
    }
    res.json({ success: true, jobDescription: user ? user.jobDescription : '' });
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

// Modified endpoint to save selected template
app.post('/api/selected-template', async (req, res) => {
  const { templateName } = req.body;
  try {
    let user;
    if (req.user) {
      user = await User.findByIdAndUpdate(req.user.id, { selectedTemplate: templateName }, { new: true });
    } else {
      user = await User.findOneAndUpdate({}, { selectedTemplate: templateName }, { new: true, upsert: true });
    }
    res.json({ success: true, message: 'Selected template saved successfully', user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error saving selected template' });
  }
});

// New endpoint to get selected template
app.get('/api/selected-template', async (req, res) => {
  try {
    let user;
    if (req.user) {
      user = await User.findById(req.user.id);
    } else {
      user = await User.findOne();
    }
    res.json({ success: true, selectedTemplate: user ? user.selectedTemplate : null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving selected template' });
  }
});

// New endpoint to get templates
app.get('/api/templates', getTemplates);

app.post('/matchJobCv', isAuthenticated, autoMatchMiddleware(User), matchJobCvRaw, createCV);

app.post('/generatePdf', isAuthenticated, cvToHtml);  

app.post('/generatePdfPreview', isAuthenticated, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    req.user = user; // Attach the full user object to the request
    cvToHtmlPreview(req, res, next);
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error retrieving user data' });
  }
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../fe/dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});