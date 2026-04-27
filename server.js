require('dotenv').config();

const express = require('express');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');

const PORT = process.env.PORT || 3000;

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.use(express.json());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());

// Routes
const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes);

// Errors
const AppError = require('./utils/AppError');
const errorHandler = require('./middleware/errorHandler');

app.use((req, res, next) => {
  next(new AppError('Route not found ❌', 404));
});

app.use(errorHandler);

// DB + Redis + Worker
const connectDB = require('./db');
const { connectRedis } = require('./config/redis');
require('./workers/emailWorker');

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};
console.log("ENV:", process.env.NODE_ENV);
startServer();