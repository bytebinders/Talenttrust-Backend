import express, { Request, Response } from 'express';
import { contracts, Contract } from './data/contracts';
import { searchItems } from './utils/search';
import { sortItems } from './utils/sorting';

export const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'talenttrust-backend' });
});

app.get('/api/v1/contracts', (req: Request, res: Response) => {
  const { search, sortBy, order } = req.query;

  let results = [...contracts];

  // Search logic
  if (search && typeof search === 'string') {
    results = searchItems(results, search, ['title', 'description']);
  }

  // Sorting logic
  const allowedSortFields: (keyof Contract)[] = ['title', 'status', 'value', 'createdAt'];
  const sortField = sortBy as keyof Contract | undefined;
  const sortOrder = (order === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc';

  results = sortItems(results, sortField, sortOrder, allowedSortFields);

  res.json({ contracts: results, total: results.length });
});
