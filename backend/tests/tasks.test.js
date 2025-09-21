
import request from 'supertest';
const BASE = 'http://localhost:' + (process.env.PORT || 4000);

let token;

beforeAll(async ()=>{
  const res = await request(BASE).post('/api/auth/login').send({username:'admin', password:'admin'});
  token = res.body.token;
});

test('list tasks requires auth', async ()=>{
  const res = await request(BASE).get('/api/tasks');
  expect(res.statusCode).toBe(401);
});

test('create + list tasks', async ()=>{
  const created = await request(BASE)
    .post('/api/tasks')
    .set('Authorization', 'Bearer ' + token)
    .send({ title: 'Write docs' });
  expect(created.statusCode).toBe(201);
  const listed = await request(BASE)
    .get('/api/tasks')
    .set('Authorization', 'Bearer ' + token);
  expect(listed.statusCode).toBe(200);
  expect(Array.isArray(listed.body)).toBe(true);
});
