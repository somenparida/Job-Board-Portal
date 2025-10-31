/**
 * Restore data from a backup folder created by scripts/backupDb.js.
 *
 * Usage (PowerShell):
 *   node backend\scripts\restoreFromBackup.js              # picks latest folder in backend/backup
 *   node backend\scripts\restoreFromBackup.js ./backend/backup/2025-10-31T06-40-37-031Z
 *
 * Notes:
 * - Users are upserted by email WITHOUT rehashing passwords (uses updateOne upsert; no save middleware).
 * - Jobs are upserted by _id if available, else (title, company) key.
 * - Applications are linked to jobs. If original job _id doesn't exist, we map by (title, company).
 * - Contact messages are upserted by _id when possible, else by (email, createdAt, message hash).
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');

const connectDB = require('../config/db');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const ContactMessage = require('../models/ContactMessage');

async function readJson(file) {
  try {
    const txt = await fs.promises.readFile(file, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    return [];
  }
}

async function pickLatestBackup(dir) {
  const entries = await fs.promises.readdir(dir).catch(() => []);
  if (!entries.length) return null;
  const folders = [];
  for (const name of entries) {
    const full = path.join(dir, name);
    const st = await fs.promises.stat(full);
    if (st.isDirectory()) folders.push({ name, time: st.mtimeMs, full });
  }
  folders.sort((a, b) => b.time - a.time);
  return folders[0]?.full || null;
}

function hash(str) {
  return crypto.createHash('sha1').update(String(str || '')).digest('hex');
}

(async () => {
  const backupRoot = path.join(__dirname, '..', 'backup');
  const arg = process.argv[2];
  const srcDir = arg ? path.resolve(arg) : await pickLatestBackup(backupRoot);
  if (!srcDir) {
    console.error('No backup folder found.');
    process.exit(1);
  }

  console.log('Restoring from:', srcDir);
  await connectDB();
  const conn = mongoose.connection;
  console.log(`Connected to db='${conn.name}' on host='${conn.host}'`);

  const users = await readJson(path.join(srcDir, 'users.json'));
  const jobs = await readJson(path.join(srcDir, 'jobs.json'));
  const apps = await readJson(path.join(srcDir, 'applications.json'));
  const msgs = await readJson(path.join(srcDir, 'contactmessages.json'));

  // Upsert users by email without rehashing (use updateOne upserts)
  let usersUpserted = 0;
  for (const u of users) {
    const {_id, ...rest} = u; // ignore _id to let Mongo assign or keep unique email
    const r = await User.updateOne(
      { email: u.email },
      { $setOnInsert: rest },
      { upsert: true }
    );
    if (r.upsertedCount) usersUpserted += 1;
  }
  const usersCount = await User.countDocuments();

  // Upsert jobs; map original _id -> target _id
  const jobIdMap = new Map();
  let jobsUpserted = 0;
  for (const j of jobs) {
    const key = { title: j.title, company: j.company };
    // Try by original _id first
    let existing = null;
    if (j._id) existing = await Job.findById(j._id).select('_id');
    if (!existing) existing = await Job.findOne(key).select('_id');

    if (!existing) {
      const {_id, ...rest} = j;
      const created = await Job.create(rest);
      jobIdMap.set(String(j._id || created._id), String(created._id));
      jobsUpserted += 1;
    } else {
      jobIdMap.set(String(j._id || existing._id), String(existing._id));
    }
  }
  const jobsCount = await Job.countDocuments();

  // Upsert applications by (email, jobId, createdAt hash)
  let appsInserted = 0;
  for (const a of apps) {
    const origJobId = a.job && (a.job._id || a.job);
    let targetJobId = origJobId && jobIdMap.get(String(origJobId));
    if (!targetJobId) {
      // Try to map by job title/company if populated
      if (a.job && a.job.title && a.job.company) {
        const j = await Job.findOne({ title: a.job.title, company: a.job.company }).select('_id');
        if (j) targetJobId = String(j._id);
      }
    }
    if (!targetJobId) continue; // skip if we can't resolve job

    const keyHash = hash(`${a.email}|${targetJobId}|${a.createdAt}`);
    const exists = await Application.findOne({ email: a.email, job: targetJobId, createdAt: new Date(a.createdAt) });
    if (!exists) {
      const doc = {
        job: targetJobId,
        name: a.name,
        email: a.email,
        phone: a.phone,
        resumeUrl: a.resumeUrl,
        coverLetter: a.coverLetter,
        createdAt: a.createdAt ? new Date(a.createdAt) : new Date(),
        _keyHash: keyHash,
      };
      await Application.create(doc);
      appsInserted += 1;
    }
  }
  const appsCount = await Application.countDocuments();

  // Upsert contact messages
  let msgsInserted = 0;
  for (const m of msgs) {
    const h = hash(`${m.email}|${m.createdAt}|${m.message}`);
    const exists = await ContactMessage.findOne({ email: m.email, createdAt: new Date(m.createdAt) });
    if (!exists) {
      await ContactMessage.create({
        name: m.name,
        email: m.email,
        message: m.message,
        createdAt: m.createdAt ? new Date(m.createdAt) : new Date(),
        _keyHash: h,
      });
      msgsInserted += 1;
    }
  }
  const msgsCount = await ContactMessage.countDocuments();

  console.log('Restore summary:');
  console.log(`  Users upserted: ${usersUpserted} (total ${usersCount})`);
  console.log(`  Jobs upserted: ${jobsUpserted} (total ${jobsCount})`);
  console.log(`  Applications inserted: ${appsInserted} (total ${appsCount})`);
  console.log(`  Messages inserted: ${msgsInserted} (total ${msgsCount})`);

  await mongoose.disconnect();
  process.exit(0);
})();
