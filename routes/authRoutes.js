const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    bcrypt.hash(password, 10, async (err, hash) => {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).send('Error during registration');
      }
      const user = await User.create({ username, password: hash });
      req.session.userId = user._id;
      req.session.user = user; // Set user object in session
      res.redirect('/');
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error(error.stack);
    res.status(500).send('Error during registration');
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      req.session.user = user; // Set user object in session
      res.redirect('/');
    } else {
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    console.error(error.stack);
    return res.status(500).send('Error during login');
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      console.error(err.stack);
      return res.status(500).send('Error logging out');
    }
    res.redirect('/auth/login');
  });
});

module.exports = router;