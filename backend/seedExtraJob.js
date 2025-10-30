require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Job = require('./models/Job');

async function run() {
  await connectDB();
  try {
    const job = new Job({
      title: 'Mobile App Developer',
      company: 'Blue Ocean Apps',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$115k - $150k',
      description: 'Build and maintain high-quality React Native apps, collaborate with API teams, and ship features to iOS and Android.',
    });
    await job.save();
    console.log('Added job:', job.title);
  } catch (err) {
    console.error('Error adding job:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
