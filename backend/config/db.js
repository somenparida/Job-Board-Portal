const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/job-portal';
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const { host, name } = mongoose.connection;
    // Mask credentials if present
    const masked = (() => {
      try {
        const u = new URL(uri);
        if (u.password) u.password = '***';
        if (u.username) u.username = '***';
        return u.toString();
      } catch { return uri.startsWith('mongodb') ? 'mongodb://***' : uri; }
    })();
    console.log(`MongoDB connected → db: ${name} @ ${host}`);
    console.log(`Using URI: ${masked}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
