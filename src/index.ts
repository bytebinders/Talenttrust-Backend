import express, { Request, Response } from 'express';
import { TransactionPoller, IBlockchainProvider } from './services/TransactionPoller';
import { transactionsDb } from './models/Transaction';

const app = express();
const PORT = process.env.PORT || 3001;

// Mock provider for demonstration purposes
const mockProvider: IBlockchainProvider = {
  getTransactionReceipt: async (hash: string) => {
    console.log(`Checking receipt for hash: ${hash}`);
    // Simulating a random success/failure or pending status
    return null; // Always pending in this mock
  }
};

const transactionPoller = new TransactionPoller(mockProvider);

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'talenttrust-backend' });
});

app.post('/api/v1/transactions', async (req: Request, res: Response) => {
  const { hash } = req.body;
  if (!hash) {
    return res.status(400).json({ error: 'Transaction hash is required' });
  }

  await transactionPoller.poll(hash);
  res.status(202).json({ message: 'Transaction polling started', hash });
});

app.get('/api/v1/transactions/:hash', (req: Request, res: Response) => {
  const { hash } = req.params;
  const transaction = transactionsDb.get(hash);
  if (!transaction) {
    return res.status(404).json({ error: 'Transaction not found' });
  }
  res.json(transaction);
});

app.get('/api/v1/contracts', (_req: Request, res: Response) => {
  res.json({ contracts: [] });
});

app.listen(PORT, () => {
  console.log(`TalentTrust API listening on http://localhost:${PORT}`);
});

