require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');

// Models
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const ContactMessage = require('../models/ContactMessage');

const outRoot = path.join(__dirname, '..', 'backup');

async function ensureDir(p) {
  await fs.promises.mkdir(p, { recursive: true });
}

async function dumpCollection(name, docs, dir) {
  const file = path.join(dir, `${name}.json`);
  await fs.promises.writeFile(file, JSON.stringify(docs, null, 2));
  console.log(`✔ wrote ${name}.json (${docs.length} docs)`);
}

(async () => {
  try {
    await connectDB();
    const conn = mongoose.connection;
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outDir = path.join(outRoot, stamp);
    await ensureDir(outDir);
    console.log(`Connected to db='${conn.name}' host='${conn.host}'. Writing backup to ${outDir}`);

    const [users, jobs, apps, msgs] = await Promise.all([
      User.find().lean(),
      Job.find().lean(),
      Application.find().lean(),
      ContactMessage.find().lean(),
    ]);

    await dumpCollection('users', users, outDir);
    await dumpCollection('jobs', jobs, outDir);
    await dumpCollection('applications', apps, outDir);
    await dumpCollection('contactmessages', msgs, outDir);

    console.log('✔ Backup complete');
  } catch (err) {
    console.error('Backup failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
