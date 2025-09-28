import mongoose from 'mongoose';

const busSchema = new mongoose.Schema({
  plateNumber: { type: String, required: true, unique: true },
  operatorName: String,
  capacity: Number,
  model: String,
  currentLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
  assignedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  status: { type: String, enum: ['idle','enroute','inactive'], default: 'idle' }
}, { timestamps: true });

export default mongoose.model('Bus', busSchema);
