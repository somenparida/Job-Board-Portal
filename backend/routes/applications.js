const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const requiredRole = require('../middleware/roles');

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
