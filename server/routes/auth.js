const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Budget = require('../models/Budget'); // Add this import
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
  const { username, password, email } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }
    const user = await User.create({ username, password, email });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role, email: user.email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username: user.username, role: user.role, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: 'http://localhost:3000/login?error=Google%20login%20failed' }),
  (req, res) => {
    try {
      console.log('Google callback - User:', req.user);
      const token = jwt.sign(
        { id: req.user._id, role: req.user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
      console.log('Google callback - Token generated for user:', req.user._id);
      res.redirect(`http://localhost:3000/dashboard?token=${token}`);
    } catch (err) {
      console.error('Google callback error:', err.message, err.stack);
      res.redirect(`http://localhost:3000/login?error=${encodeURIComponent('Server error during Google login')}`);
    }
  }
);

router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ id: user._id, username: user.username, role: user.role, email: user.email });
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/profile', auth, async (req, res) => {
  const { password } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (password && !user.googleId) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      user.password = password;
      await user.save();
    }
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    console.log(`Deleting profile for user: ${userId}`);

    // Delete all budgets associated with the user
    await Budget.deleteMany({ userId: req.user.id });
    console.log(`Deleted budgets for user: ${userId}`);

    // Delete the user
    await User.findByIdAndDelete(req.user.id);
    console.log(`Deleted user: ${userId}`);

    res.json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.error('Delete profile error:', err);
    res.status(500).json({ message: 'Server error during account deletion' });
  }
});

module.exports = router;