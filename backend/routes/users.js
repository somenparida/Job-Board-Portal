const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const requiredRole = require('../middleware/roles');

// get all users (admin)
router.get('/', auth, requiredRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// create user (admin)
router.post(
  '/',
  auth,
  requiredRole('admin'),
  [body('name').notEmpty().withMessage('Name required'), body('email').isEmail().withMessage('Valid email required'), body('password').isLength({ min: 8 }).withMessage('Password min 8 chars')],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });
    try {
      const { name, email, password, role } = req.body;
      const user = new User({ name, email, password, role });
      await user.save();
      res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

// update user (admin)
router.put('/:id', auth, requiredRole('admin'), async (req, res) => {
  try {
    const updates = req.body;
    if (updates.password) delete updates.password; // changing password handled elsewhere
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// delete user (admin)
router.delete('/:id', auth, requiredRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
