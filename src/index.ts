import express, { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'talenttrust-backend' });
});

import reputationRoutes from './routes/reputation.routes';

app.use('/api/v1/contracts', (_req: Request, res: Response) => {
  res.json({ contracts: [] });
});

app.use('/api/v1/reputation', reputationRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`TalentTrust API listening on http://localhost:${PORT}`);
  });
}

export default app;
