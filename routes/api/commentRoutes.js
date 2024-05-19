const express = require('express');
const router = express.Router();
const Comment = require('../../models/Comment');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/api/comments', isAuthenticated, async (req, res) => {
  try {
    const { content, articleId } = req.body;
    const userId = req.session.userId;

    if (!content || !articleId) {
      return res.status(400).json({ message: 'Content and article ID are required.' });
    }

    const comment = new Comment({
      user: userId,
      article: articleId,
      content
    });

    await comment.save();
    res.status(201).json({ message: 'Comment added successfully.', comment });
  } catch (error) {
    console.error('Error saving comment:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Failed to add comment.' });
  }
});

router.get('/api/comments', async (req, res) => {
  try {
    const { articleId } = req.query;
    if (!articleId) {
      return res.status(400).json({ message: 'Article ID is required.' });
    }

    const comments = await Comment.find({ article: articleId }).populate('user');
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    console.error(error.stack);
    res.status(500).json({ message: 'Failed to fetch comments.' });
  }
});

module.exports = router;