require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

// connect to DB
connectDB();

// routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/jobs', require('./routes/jobs'));
app.use('/api', require('./routes/misc'));
app.use('/api/applications', require('./routes/applications'));

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.send('✅ Job Board API is running...');
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
