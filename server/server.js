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
const isProd = process.env.NODE_ENV === 'production';
const hasRedisUrl = !!process.env.REDIS_URL;
const isLocalRedis = hasRedisUrl && /127\.0\.0\.1|localhost/.test(process.env.REDIS_URL);

const normalizePort = (value) => {
  const port = Number.parseInt(value, 10);
  return Number.isNaN(port) ? value : port;
};

const startListening = (initialPort) => {
  const port = normalizePort(initialPort);

  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${server.address().port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && typeof port === 'number') {
      const nextPort = port + 1;
      console.warn(`⚠️ Port ${port} is in use, retrying on ${nextPort}`);
      server.close(() => startListening(nextPort));
      return;
    }

    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  });

  return server;
};

if (hasRedisUrl && !(isProd && isLocalRedis)) {
  require('./workers/emailWorker');
} else {
  if (isProd && isLocalRedis) {
    console.warn('⚠️ REDIS_URL points to localhost in production, worker disabled');
  } else {
    console.warn('⚠️ REDIS_URL not set, worker disabled');
  }
}

// Start server
const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    startListening(PORT);

  } catch (err) {
    console.error('❌ Server failed to start:', err.message);
    process.exit(1);
  }
};
console.log("ENV:", process.env.NODE_ENV);
startServer();