const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const mongoose = require('mongoose');

router.get('/article/:id', async (req, res) => {
  try {
    // Cast the article ID to ObjectId to ensure it's a valid MongoDB ID
    const validId = mongoose.Types.ObjectId.isValid(req.params.id);
    if (!validId) {
      return res.status(400).send('Invalid article ID');
    }

    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).send('Article not found');
    }

    const comments = await Comment.find({ article: article._id }).populate('user');
    res.render('article', { article, comments });
  } catch (error) {
    console.error('Error fetching article:', error);
    console.error(error.stack);
    res.status(500).send('Error fetching article');
  }
});

module.exports = router;