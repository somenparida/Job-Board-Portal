require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Job = require('./models/Job');

async function run() {
  await connectDB();
  try {
    const title = 'Machine Learning Engineer';
    const company = 'NeuralNet Labs';
    const existing = await Job.findOne({ title, company });
    if (existing) {
      console.log(`Job already exists: ${existing._id}`);
      return;
    }

    const now = new Date();
    const job = new Job({
      title,
      company,
      location: 'Remote',
      description: 'Develop and deploy production-grade ML models. Work closely with data scientists and platform engineers to scale inference.',
      type: 'Full-time',
      salary: '$140k - $180k',
      createdAt: now,
    });

    await job.save();
    console.log('Inserted new job:', job._id.toString());
  } catch (err) {
    console.error('Error inserting job:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
