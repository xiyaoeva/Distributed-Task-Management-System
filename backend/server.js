
import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './src/routes/auth.js';
import tasksRouter from './src/routes/tasks.js';
import { initSocket } from './src/socket.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CORS_ORIGIN || '*' } });
initSocket(io);

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

app.get('/api/health', (req,res)=> res.json({status:'ok'}));
app.use('/api/auth', authRouter);
app.use('/api/tasks', tasksRouter);

// Mongo
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dtm';
mongoose.connect(MONGO_URI).then(()=> console.log('Mongo connected')).catch(err=> console.error(err));

const PORT = process.env.PORT || 4000;
server.listen(PORT, ()=> console.log('Backend on :' + PORT));
