
import { Router } from 'express';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import '../utils/seed.js'; // ensure seed runs at startup (idempotent)

const router = Router();

router.post('/login', async (req,res)=>{
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if(!user || !(await user.comparePassword(password))){
    return res.status(401).json({ error: 'invalid credentials' });
  }
  const token = signToken({ sub: user._id.toString(), username, role: user.role });
  res.json({ token, role: user.role });
});

export default router;
