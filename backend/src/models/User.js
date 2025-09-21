
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','user'], default: 'user' }
});

UserSchema.methods.comparePassword = async function(pw) {
  return bcrypt.compare(pw, this.password);
};

export default mongoose.model('User', UserSchema);
