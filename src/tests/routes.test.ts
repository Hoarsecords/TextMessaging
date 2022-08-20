import getDBConnection from '../utils/getDBConnection';
import request from 'supertest';
import buildServer from '../utils/buildServer';

const app = buildServer();
const db = getDBConnection();

beforeAll(async () => {
  // console.log(`🚀 ~ file: routes.test.ts ~ line 9 ~ beforeAll ~ db`, db);
  await db.sync();
});

afterAll(async () => {});

describe('Post Endpoints', () => {
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

  it('should return an authenticated user', async () => {
    const res = await request(app).get('/me');
    console.log(`🚀 ~ file: routes.test.ts ~ line 43 ~ it ~ res`, res.body);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('isSuccess');
    expect(res.body?.isSuccess).toBe(true);
  });

  it('should return an error that the user is already connected to this chatroom', async () => {
    const res = await request(app).post('/connect/5');
    // console.log(`🚀 ~ file: routes.test.ts ~ line 34 ~ it ~ res`, res.body);

    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(false);
    expect(res.body).toHaveProperty('error');
  });
});
