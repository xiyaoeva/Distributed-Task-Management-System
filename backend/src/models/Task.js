
import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  completed: { type: Boolean, default: false },
  owner: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Task', TaskSchema);
