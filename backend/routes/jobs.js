const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const Application = require('../models/Application');
const auth = require('../middleware/auth');
const requiredRole = require('../middleware/roles');
const { body, validationResult } = require('express-validator');

// get all jobs (public, with search)
router.get('/', async (req, res) => {
  try {
    const { q, company, location } = req.query;
    const filter = {};
    if (q) filter.title = new RegExp(q, 'i');
    if (company) filter.company = new RegExp(company, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    const jobs = await Job.find(filter).populate('postedBy', 'name email');
    res.json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// get job by id
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// create job (admin)
router.post('/', auth, requiredRole('admin'), async (req, res) => {
  try {
    const job = new Job({ ...req.body, postedBy: req.user.id });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// update job (admin)
router.put('/:id', auth, requiredRole('admin'), async (req, res) => {
  try {
    const updates = { ...req.body, updatedAt: Date.now() };
    const job = await Job.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// delete job (admin)
router.delete('/:id', auth, requiredRole('admin'), async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// apply to a job (public)
router.post(
  '/:id/apply',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('phone').optional({ checkFalsy: true }).trim().isString(),
    body('resumeUrl')
      .optional({ checkFalsy: true })
      .trim()
      .isURL({ require_protocol: true })
      .withMessage('Resume URL must be a valid URL starting with http(s)://'),
    body('coverLetter').optional({ checkFalsy: true }).isString(),
  ],
  async (req, res) => {
    try {
      // If resumeUrl contains extra text, attempt to extract the first URL substring
      if (req.body && typeof req.body.resumeUrl === 'string') {
        const text = req.body.resumeUrl.trim();
        if (text && !/^https?:\/\//i.test(text)) {
          const match = text.match(/https?:\/\/\S+/i);
          if (match) {
            req.body.resumeUrl = match[0];
          }
        }
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const list = errors.array();
        return res.status(400).json({ message: list[0].msg, errors: list });
      }

      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: 'Job not found' });

      const app = new Application({ job: job._id, ...req.body });
      await app.save();
      res.status(201).json({ message: 'Application submitted', applicationId: app._id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

module.exports = router;
