require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');

async function run() {
  await connectDB();
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const newPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Admin user not found:', email);
      process.exit(0);
    }
    user.password = newPassword;
    await user.save();
    console.log(`Password for ${email} set to provided value.`);
  } catch (err) {
    console.error('Error resetting admin password:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();
