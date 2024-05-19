const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');
const Article = require('../models/Article');
const User = require('../models/User');
const methodOverride = require('method-override');
const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/admin', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user && user.isAdmin) {
      const articles = await Article.find();
      res.render('admin', { articles });
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error fetching user or articles:', error);
    console.error(error.stack);
    if (error.message.includes('Cast to ObjectId failed')) {
      res.status(404).send('User not found');
    } else if (error.message.includes('Article.find')) {
      res.status(500).send('Error fetching articles');
    } else {
      res.status(500).send('Error fetching user or articles');
    }
  }
});

router.post('/admin/delete/:id', isAuthenticated, methodOverride('_method', { methods: ['POST'] }), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user && user.isAdmin) {
      const article = await Article.findByIdAndDelete(req.params.id);
      if (!article) {
        return res.status(404).send('Article not found');
      }
      res.redirect('/admin');
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error deleting article:', error);
    console.error(error.stack);
    res.status(500).send('Error deleting article');
  }
});

router.get('/admin/create', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user && user.isAdmin) {
      res.render('createArticle');
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    console.error(error.stack);
    res.status(500).send('Error fetching user');
  }
});

router.post('/admin/create', isAuthenticated, upload.single('content'), async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (user && user.isAdmin) {
      const { title } = req.body;
      const content = req.file ? req.file.buffer.toString() : '';

      if (!title || !content) {
        return res.status(400).send('Title and content are required');
      }

      const newArticle = new Article({
        title,
        content,
        publishDate: new Date()
      });

      await newArticle.save();
      res.redirect('/admin');
    } else {
      res.status(403).send('Access denied');
    }
  } catch (error) {
    console.error('Error creating article:', error);
    console.error(error.stack);
    res.status(500).send('Error creating article');
  }
});

module.exports = router;