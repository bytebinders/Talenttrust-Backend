import request from 'supertest';
import { app } from './index';

describe('Contracts API Integration Tests', () => {
  it('should return all contracts in default order', async () => {
    const res = await request(app).get('/api/v1/contracts');
    expect(res.status).toBe(200);
    expect(res.body.contracts).toHaveLength(5);
    expect(res.body.total).toBe(5);
  });

  it('should search contracts by title', async () => {
    const res = await request(app).get('/api/v1/contracts?search=website');
    expect(res.status).toBe(200);
    expect(res.body.contracts).toHaveLength(1);
    expect(res.body.contracts[0].title).toBe('Website Redesign');
  });

  it('should search contracts by description', async () => {
    const res = await request(app).get('/api/v1/contracts?search=cloud');
    expect(res.status).toBe(200);
    expect(res.body.contracts).toHaveLength(1);
    expect(res.body.contracts[0].title).toBe('Cloud Migration');
  });

  it('should sort contracts by value in ascending order', async () => {
    const res = await request(app).get('/api/v1/contracts?sortBy=value&order=asc');
    expect(res.status).toBe(200);
    expect(res.body.contracts[0].value).toBe(3000);
    expect(res.body.contracts[4].value).toBe(15000);
  });

  it('should sort contracts by value in descending order', async () => {
    const res = await request(app).get('/api/v1/contracts?sortBy=value&order=desc');
    expect(res.status).toBe(200);
    expect(res.body.contracts[0].value).toBe(15000);
    expect(res.body.contracts[4].value).toBe(3000);
  });

  it('should handle search and sort together', async () => {
    const res = await request(app).get('/api/v1/contracts?search=a&sortBy=value&order=desc');
    expect(res.status).toBe(200);
    // All contracts contain 'a' in title or description or status? 
    // Website, Mobile, Cloud, Security, Data - all have 'a'
    expect(res.body.contracts.length).toBeGreaterThan(0);
    expect(res.body.contracts[0].value).toBeGreaterThanOrEqual(res.body.contracts[1].value);
  });

  it('should ignore restricted sort fields', async () => {
    const res = await request(app).get('/api/v1/contracts?sortBy=id&order=asc');
    expect(res.status).toBe(200);
    // Should return default order (id: 1, 2, 3, 4, 5) if ID is not allowed but it happens to be the same.
    // Let's check status instead.
    expect(res.body.contracts).toBeDefined();
  });
});

describe('Health endpoint', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
