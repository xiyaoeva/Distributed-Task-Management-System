
import { Router } from 'express';
import Task from '../models/Task.js';
import { requireAuth } from '../middleware/auth.js';
import { emitTaskCreated } from '../socket.js';

const router = Router();

router.get('/', requireAuth, async (req,res)=>{
  const tasks = await Task.find().sort({ createdAt: -1 }).limit(100);
  res.json(tasks);
});

router.post('/', requireAuth, async (req,res)=>{
  const { title } = req.body;
  if(!title) return res.status(400).json({error:'title required'});
  const task = await Task.create({ title, owner: req.user.username });
  emitTaskCreated(task);
  res.status(201).json(task);
});

export default router;
