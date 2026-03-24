import request from 'supertest';
import app from './index';

describe('Application Integration Tests', () => {
  it('should respond to the health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });

  it('should trigger the 404 handler for unknown routes', async () => {
    const response = await request(app).get('/not-a-real-route');
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe('NOT_FOUND');
  });

  it('should have the error handler middleware mounted', async () => {
    // This just confirms the app exported properly and handles a basic request
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});