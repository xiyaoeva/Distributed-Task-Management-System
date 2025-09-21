
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import appServer from '../server.js'; // imports and starts server; we will reimport express routes differently in tests

dotenv.config();

// For tests, directly import express app by factoring server? For simplicity, call running server via URL.
const BASE = 'http://localhost:' + (process.env.PORT || 4000);

beforeAll(async ()=>{
  // ensure mongo
  if(!mongoose.connection.readyState){
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/dtm');
  }
});

afterAll(async ()=>{
  await mongoose.disconnect();
});

test('health', async ()=>{
  const res = await request(BASE).get('/api/health');
  expect(res.statusCode).toBe(200);
  expect(res.body.status).toBe('ok');
});

test('login admin', async ()=>{
  const res = await request(BASE).post('/api/auth/login').send({username:'admin', password:'admin'});
  expect(res.statusCode).toBe(200);
  expect(res.body.token).toBeDefined();
});
