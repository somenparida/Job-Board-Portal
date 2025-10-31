const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const requiredRole = require('../middleware/roles');

// list applications for the logged-in user (by email)
// Rationale: applications are currently tied to name/email, not userId. We
// use the authenticated user's email to fetch their applications.
router.get('/my', auth, async (req, res) => {
  try {
    const User = require('../models/User');
    const me = await User.findById(req.user.id).select('email');
    if (!me) return res.status(404).json({ message: 'User not found' });
    const apps = await Application.find({ email: me.email })
      .sort({ createdAt: -1 })
      .populate('job', 'title company location salary');
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// list applications (admin). Optional ?job=<jobId>
router.get('/', auth, requiredRole('admin'), async (req, res) => {
  try {
    const filter = {};
    if (req.query.job) filter.job = req.query.job;
    const apps = await Application.find(filter).sort({ createdAt: -1 }).populate('job', 'title company');
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// delete application (admin)
router.delete('/:id', auth, requiredRole('admin'), async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: 'Application deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
