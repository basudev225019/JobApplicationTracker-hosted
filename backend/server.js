require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// reuse the same connection between requests (needed on vercel serverless)
let connection = null;
function connectdb() {
  if (!connection) {
    connection = mongoose.connect(process.env.MONGO_URI).catch((err) => {
      connection = null;
      throw err;
    });
  }
  return connection;
}

const app = express();
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
  try {
    await connectdb();
    next();
  } catch (err) {
    console.log('DB connection error:', err.message);
    res.status(500).json({ success: false, message: 'Database connection failed', data: null });
  }
});

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Job Tracker API is Running', data: null });
});

app.get('/api', (req, res) => {
  res.json({ success: true, message: 'Job Tracker API is Running', data: null });
});

app.use('/api/applications', require('./routes/applications'));

// only start a server when run locally with node server.js (vercel imports the app instead)
if (require.main === module) {
  const port = process.env.PORT || 5000;
  connectdb()
    .then(() => {
      console.log('MongoDB connected');
      app.listen(port, () => console.log('Server running on port ' + port));
    })
    .catch((err) => {
      console.log('DB connection error:', err.message);
    });
}

module.exports = app;
