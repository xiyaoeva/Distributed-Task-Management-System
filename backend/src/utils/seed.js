
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/dtm';

async function run() {
  await mongoose.connect(MONGO_URI);
  const count = await User.countDocuments();
  if (count === 0) {
    const users = [
      { username: 'admin', password: await bcrypt.hash('admin', 10), role: 'admin' },
      { username: 'alice', password: await bcrypt.hash('alice', 10), role: 'user' },
    ];
    await User.insertMany(users);
    console.log('Seeded users: admin/admin, alice/alice');
  } else {
    console.log('Users already exist, skipping seed.');
  }
  await mongoose.disconnect();
}

run().catch(e=> { console.error(e); process.exit(1); });
