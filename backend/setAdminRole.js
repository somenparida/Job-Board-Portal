require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

async function run() {
  await connectDB();
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      process.exit(0);
    }
    if (user.role === 'admin') {
      console.log('User already admin:', email);
      process.exit(0);
    }
    user.role = 'admin';
    await user.save();
    console.log('Updated role to admin for', email);
  } catch (err) {
    console.error('Error updating role:', err);
    process.exitCode = 1;
  } finally {
    await require('mongoose').connection.close();
  }
}

run();
