import request from 'supertest';
import app from './index';

describe('App Endpoints', () => {
  it('should return 200 on /health', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'talenttrust-backend' });
  });

  it('should return 200 on /api/v1/contracts', async () => {
    const res = await request(app).get('/api/v1/contracts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ contracts: [] });
  });
});
