import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';

import leadsRouter from './routes/leads.js';
import templatesRouter from './routes/templates.js';
import campaignsRouter from './routes/campaigns.js';
import analyticsRouter from './routes/analytics.js';

const app = express();
const logger = pino({ level: process.env.NODE_ENV === 'production' ? 'info' : 'debug' });

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Allow multiple origins for CORS
const allowedOrigins = [
  FRONTEND_URL,
  'https://real-mailing.onrender.com',
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in production for now
      }
    },
    credentials: true
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(
  pinoHttp({
    logger,
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    }
  })
);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use('/api/leads', leadsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api/campaigns', campaignsRouter);
app.use('/api/analytics', analyticsRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` }
  });
});

app.use((err, _req, res, _next) => {
  logger.error({ err }, 'Unhandled error');
  res.status(err.status || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error'
    }
  });
});

app.listen(PORT, () => {
  logger.info(`Server listening on port ${PORT}`);
});

