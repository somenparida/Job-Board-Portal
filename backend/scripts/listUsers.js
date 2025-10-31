require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    const conn = mongoose.connection;
    console.log(`Connected DB → name: ${conn.name}, host: ${conn.host}`);
    const count = await User.countDocuments();
    console.log(`Users count: ${count}`);
    const docs = await User.find({}, { name: 1, email: 1, role: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
    console.table(docs);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
