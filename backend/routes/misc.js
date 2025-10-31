const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');
const requiredRole = require('../middleware/roles');

// Health endpoint (optional)
router.get('/health', (_req, res) => {
  const conn = require('mongoose').connection;
  res.json({
    ok: true,
    db: {
      state: conn.readyState, // 1 connected, 0 disconnected
      name: conn.name,
    },
  });
});

// Contact form
router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const list = errors.array();
      return res.status(400).json({ message: list[0].msg, errors: list });
    }
    try {
      const doc = new ContactMessage(req.body);
      await doc.save();
      res.status(201).json({ message: 'Thanks! Your message has been sent.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// List contact messages (admin only)
router.get('/contact-messages', auth, requiredRole('admin'), async (req, res) => {
  try {
    const docs = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a message (admin only)
router.delete('/contact-messages/:id', auth, requiredRole('admin'), async (req, res) => {
  try {
    await ContactMessage.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
