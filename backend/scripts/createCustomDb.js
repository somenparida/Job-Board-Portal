#!/usr/bin/env node
/*
  Create a custom MongoDB database for this app.
  Usage examples (PowerShell):
    # create with defaults (db=job-portal-custom, host=127.0.0.1, port=27017)
    node scripts/createCustomDb.js

    # custom name
    node scripts/createCustomDb.js --name=my-job-db

    # custom host/port
    node scripts/createCustomDb.js --name=my-job-db --host=127.0.0.1 --port=27018

    # seed with sample data
    node scripts/createCustomDb.js --name=my-job-db --seed
*/

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Simple argv parser
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
  const ix = args.findIndex(a => a === flag || a.startsWith(flag + '='));
  if (ix === -1) return fallback;
  const val = args[ix].includes('=') ? args[ix].split('=')[1] : args[ix + 1];
  return val ?? fallback;
};
const hasFlag = (flag) => args.some(a => a === flag || a.startsWith(flag + '='));

const dbName = getArg('--name', 'job-portal-custom');
const host = getArg('--host', '127.0.0.1');
const port = getArg('--port', '27017');
const shouldSeed = hasFlag('--seed');

const uri = `mongodb://${host}:${port}/${dbName}`;

(async () => {
  try {
    console.log(`[custom-db] Connecting to ${uri} ...`);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Load models (uses the default mongoose connection above)
    const User = require('../models/User');
    const Job = require('../models/Job');
    const Application = require('../models/Application');
    const ContactMessage = require('../models/ContactMessage');

    // Ensure collections & indexes are created
    await Promise.all([
      User.init(), Job.init(), Application.init(), ContactMessage.init()
    ]);

    console.log(`[custom-db] Database ready: ${dbName}`);

    if (shouldSeed) {
      console.log('[custom-db] Seeding sample data...');

      // Admin user seed if not exists
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
      const adminName = process.env.ADMIN_NAME || 'Admin';

      let admin = await User.findOne({ email: adminEmail });
      if (!admin) {
        const bcrypt = require('bcryptjs');
        const hashed = await bcrypt.hash(adminPassword, 10);
        admin = await User.create({ name: adminName, email: adminEmail, password: hashed, role: 'admin' });
        console.log(`[custom-db] Created admin user: ${adminEmail}`);
      } else {
        console.log(`[custom-db] Admin user already exists: ${adminEmail}`);
      }

      // Few sample jobs
      const now = new Date();
      const sampleJobs = [
        {
          title: 'Data Scientist', company: 'DataCo', location: 'Boston', type: 'Full-time', salary: '$118k–$160k',
          description: 'Analyze complex datasets and build ML models. Drive data-driven decisions.', createdAt: now, updatedAt: now
        },
        {
          title: 'Product Manager', company: 'StartupXYZ', location: 'Remote', type: 'Full-time', salary: '$95k–$130k',
          description: 'Lead product strategy and roadmap. Work closely with engineering and design teams.', createdAt: now, updatedAt: now
        },
        {
          title: 'Senior Backend Engineer', company: 'DevCorp', location: 'Seattle', type: 'Full-time', salary: '$130k–$180k',
          description: 'Build robust backend systems and APIs.', createdAt: now, updatedAt: now
        }
      ];

      const countBefore = await Job.countDocuments();
      await Job.insertMany(sampleJobs);
      const countAfter = await Job.countDocuments();
      console.log(`[custom-db] Inserted ${countAfter - countBefore} jobs (total: ${countAfter}).`);

      // One sample contact message
      await ContactMessage.create({ name: 'Test User', email: 'test@example.com', message: 'Hello from custom DB!', createdAt: new Date() });
      console.log('[custom-db] Inserted 1 contact message.');
    }

    console.log('[custom-db] Done. You can point MONGO_URI to this DB in backend/.env:');
    console.log(`MONGO_URI=${uri}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[custom-db] Failed:', err.message);
    process.exit(1);
  }
})();
