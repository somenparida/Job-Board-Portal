require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const run = async () => {
  await connectDB();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const name = process.env.ADMIN_NAME || 'Admin';
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  let user = await User.findOne({ email });
  if (user) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  user = new User({ name, email, password, role: 'admin' });
  await user.save();
  console.log('Created admin user:', email);
  process.exit(0);
};

run().catch(err => { console.error(err); process.exit(1); });
