import express from 'express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

// Health check route
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'talenttrust-backend' });
});

// Register handlers - Order is important
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

/* istanbul ignore next */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TalentTrust API listening on http://localhost:${PORT}`);
  });
}

export default app;