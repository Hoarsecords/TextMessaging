import getDBConnection from '../utils/getDBConnection';
import request from 'supertest';
import buildServer from '../utils/buildServer';

const app = buildServer();
const db = getDBConnection();

beforeAll(async () => {
  await db.sync();
});

afterAll(async () => {
  await db.drop();
});

describe('Testing Endpoints', () => {
  it('should return not authenticated error', async () => {
    const res = await request(app).get('/me');

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('isFailure');
    expect(res.body?.isFailure).toBe(true);
  });
  it('should return a not found error, As there is not users in the database yet', async () => {
    const res = await request(app).post('/random-login');

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error');
  });

  it('should return a new chatroom', async () => {
    const res = await request(app).post('/connect/5');

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.value).toHaveProperty('creatorId');
    expect(res.body.value).toHaveProperty('id');
  });

  it('should return an error that user is not authenticated', async () => {
    const res = await request(app).post('/disconnect/6');

    expect(res.statusCode).toEqual(401);
    expect(res.body.isSuccess).toBe(false);
    expect(res.body.error).toHaveProperty('message');
    expect(res.body.error).toHaveProperty('name');
    expect(res.body.error).toHaveProperty('code');
  });
});
